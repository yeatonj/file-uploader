const { PrismaClient } = require('../generated/prisma');
const { genPassword } = require("../lib/passwordUtils");

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
  deleteDirectory
}