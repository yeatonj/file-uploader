const { Router } = require("express");
const viewFileController = require("../controllers/viewFileController");
const viewFileRouter = Router();


viewFileRouter.get("/", viewFileController.viewFileGetNoFile);
viewFileRouter.get("/:fileId", viewFileController.viewFileGet);
viewFileRouter.get("/:fileId/download", viewFileController.viewFileGetDownload);
viewFileRouter.post("/delete", viewFileController.viewFileDeletePost);
viewFileRouter.post("/upload", viewFileController.uploadMiddleware, viewFileController.viewFileUploadPost);
module.exports = viewFileRouter;