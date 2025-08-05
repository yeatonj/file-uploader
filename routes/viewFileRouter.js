const { Router } = require("express");
const viewFileController = require("../controllers/viewFileController");
const viewFileRouter = Router();

viewFileRouter.get("/", viewFileController.viewFileGetNoFile);
viewFileRouter.get("/:fileId", viewFileController.viewFileGet);
viewFileRouter.post("/delete", viewFileController.viewFileDeletePost);
viewFileRouter.post("/upload", viewFileController.viewFileUploadPost);

module.exports = viewFileRouter;