const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware");

const {
  getItems,
  getItemsByType,
  addItem,
  updateItem,
  deleteItem,
} = require("../../controllers/Other/itemsboard.controller");

router.get("/getItems", getItems);
router.get("/getItemsByType", getItemsByType);
router.post("/addItem", upload.single("itemsboard"), addItem);
router.patch("/updateItem/:id", updateItem);
router.delete("/deleteItem/:id", deleteItem);

module.exports = router;