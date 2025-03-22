const Item = require("../models/Item");

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("reportedBy", "userName email");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "userName email");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving item" });
  }
};

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { item_id, itemName, location, description, reportedBy } = req.body;
    const newItem = new Item({ item_id, itemName, location, description, reportedBy });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
};
