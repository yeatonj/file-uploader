const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexrouter = Router();

indexrouter.get("/", indexController.indexGet);

module.exports = indexrouter;