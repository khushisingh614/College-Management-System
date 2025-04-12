const StudentItem = require("../../models/Other/itemsboard.model");

// GET all items
exports.getItems = async (req, res) => {
  try {
    const items = await StudentItem.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
};

// ✅ GET items by type (from query param)
exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.query; // previously from req.params
    const items = await StudentItem.find({ itemType: type }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch items by type" });
  }
};

// ✅ POST new item (image field is 'image')
exports.addItem = async (req, res) => {
  try {
    const { title, description, location, itemType, studentId, mobilenumber } = req.body;
    const newItem = new StudentItem({
      title,
      description,
      location,
      itemType,
      studentId,
      mobilenumber,
      imageUrl: req.file ? `${req.file.filename}` : null,
    });
    await newItem.save();
    res.json({ success: true, item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add item" });
  }
};

// ✅ PATCH update item (partial updates)
exports.updateItem = async (req, res) => {
  try {
    const updated = await StudentItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    await StudentItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};