const { Router } = require("express");
const filesController = require("../controllers/filesController");
const filesRouter = Router();

filesRouter.get("/", filesController.filesGet);
filesRouter.get("/:dirId", filesController.filesGet);
filesRouter.post("/newdir", filesController.filesDirPost);
filesRouter.post("/updatedirname", filesController.filesDirRenamePost);
filesRouter.post("/delete", filesController.filesDirDelete);

module.exports = filesRouter;