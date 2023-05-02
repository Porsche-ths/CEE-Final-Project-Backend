const express = require("express");
const tableController = require("../controller/tableController");

const router = express.Router();

router.get("/", tableController.getTable);
router.get("/:student_id", tableController.getStudentTable);
router.get("/:student_id/:item_id",tableController.getRow);
router.post("/", tableController.addItem);
router.delete("/:item_id", tableController.deleteItem);

module.exports = router;