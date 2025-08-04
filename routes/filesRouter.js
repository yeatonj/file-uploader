const { Router } = require("express");
const filesController = require("../controllers/filesController");
const filesRouter = Router();

filesRouter.get("/", filesController.filesGet);
filesRouter.get("/:dirId", filesController.filesGet);
filesRouter.post("/", filesController.filesPost);

module.exports = filesRouter;