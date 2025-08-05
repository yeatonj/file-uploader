const { PrismaClient } = require('../generated/prisma');
const { genPassword } = require("../lib/passwordUtils");

const { deleteFile } = require("../fs_util/manager");

const prisma = new PrismaClient();

async function getUserFromUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
        email: username,
    }
  });
  return user;
}

async function getUserFromId(id) {
  const user = await prisma.user.findFirst({
    where: {
        id: id,
    }
  });

  return user;
}

async function addUser(username, password, first, last) {
    const dbPw = await genPassword(password);
    await prisma.user.create({
        data: {
            email: username,
            first: first,
            last: last,
            password: dbPw
        },
    });
    // Now we need to give this user a root directory
    const user = await prisma.user.findUnique({
    where: {
            email: username,
        }
    });
    await prisma.directories.create({
        data: {
            user_id: user.id,
            name: 'root',
            parent_dir: null
        }
    });
}

async function addDirectory(userId, dirName, parent) {
    await prisma.directories.create({
        data: {
            user_id: userId,
            name: dirName,
            parent_dir: parent
        }
    });
}

async function getDirectoryDetails(dirId) {
    const details = await prisma.directories.findFirst({
        where: {
            id: dirId
        }
    });
    return details;
}

async function getDirectoryContents(dirId) {
    const contents = await prisma.directories.findMany({
        where: {
            parent_dir: dirId
        }
    });
    return contents;
}

async function getRootDirectoryDetails(userId) {
    const details = await prisma.directories.findFirst({
        where: {
            user_id: userId,
            parent_dir: null
        }
    });
    return details;
}

async function renameDirectory(dirId, newName) {
    await prisma.directories.update({
        where: {
            id: dirId
        },
        data: {
            name: newName
        },
    });
}

async function deleteDirectory(dirId) {
    // First, ensure we NEVER delete a user's root directory
    const details = await prisma.directories.findFirst({
        where: {
            id: dirId,
        }
    });
    if (details.name === "root" && details.parent_dir === null) {
        return;
    }
    // Delete all files in this directory, including on disk
    deleteDirFiles(dirId);
    // Now, go ahead and delete subdirectories. We'll need to do so recursively.
    // First, delete all subdirectories
    const subDir = await getDirectoryContents(dirId);
    for (let i = 0; i < subDir.length; i++) {
        await deleteDirectory(subDir[i].id);
    }
    // Then, delete ourselves
    await prisma.directories.delete({
        where: {
            id: dirId,
        },
    });
}

// Function gets the prefix for an uploaded file given a directory
async function getPathPrefix(dirId) {
    // Prefix should be userid/dir1id__dir2id__...__dirnid
    // Looking up from the current directory to root
    let current = await prisma.directories.findFirst({
        where: {
            id: dirId,
        }
    });
    let prefix = String(current.user_id) + "_" + String(current.id);
    while (current.parent_dir) {
        current = await prisma.directories.findFirst({
            where: {
                id: current.parent_dir,
            }
        });
        prefix = prefix + "__" + String(current.id);
    }
    return prefix;
}

// Gets all files in a directory
async function getDirFiles(dirId) {
    const res = await prisma.file.findMany({
        where: {
            dir_id: dirId,
        },
    });
    return res;
}

// Gets details of a file
async function getFile(fileId){
    const res = await prisma.file.findFirst({
        where: {
            id: fileId,
        },
    });
    return res;
}

// Allows us to add a file to the DB
async function addFile(owner, dir, fName, fSize, fDiskName) {
    try {
        await prisma.file.create({
            data: {
                owner_id: owner,
                dir_id: dir,
                name: fName,
                size: fSize,
                disk_name: fDiskName,
            },
        });
        return true
    } catch {
        return false;
    }
}

// Allows us to delete a file from the DB (return name to faciliate deletion on disk)
async function deleteDBFile(fileId) {
    const deleted = await prisma.file.delete({
        where: {
            id: fileId,
        },
    });
    return deleted;
}

// Allows us to delete all files in a directory
async function deleteDirFiles(dirId) {
    // First, get all the files
    const deleted = await prisma.file.deleteMany({
        where: {
            dir_id: dirId,
        },
    });
    for (let i = 0; i < deleted.length; i++) {
        deleteFile(deleted[i].disk_name);
    }
}

module.exports = {
  getUserFromUsername,
  getUserFromId,
  addUser,
  addDirectory,
  getDirectoryDetails,
  getDirectoryContents,
  getRootDirectoryDetails,
  renameDirectory,
  deleteDirectory,
  getPathPrefix,
  getDirFiles,
  getFile,
  addFile,
  deleteDBFile,
  deleteDirFiles
}