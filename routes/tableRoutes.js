const express = require("express");
const tableController = require("../controller/tableController");

const router = express.Router();

router.get("/", tableController.getTable);
router.post("/", tableController.addItem);
router.delete("/:item_id", tableController.deleteItem);

module.exports = router;
