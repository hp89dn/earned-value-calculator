const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.post("/create", adminController.create);
router.post("/delete/uid=:uid/id=:id", adminController.delete);
router.put("/update", adminController.update);

module.exports = router;