const Visitor = require("../models/Visitor");

// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate("registeredBy", "userName email");
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving visitors" });
  }
};

// Get a single visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate("registeredBy", "userName email");
    if (!visitor) return res.status(404).json({ error: "Visitor not found" });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving visitor" });
  }
};

// Create a new visitor record
exports.createVisitor = async (req, res) => {
  try {
    const { visitor_id, visitor_name, phoneNumber, purposeOfVisit, email, registeredBy } = req.body;
    const newVisitor = new Visitor({ visitor_id, visitor_name, phoneNumber, purposeOfVisit, email, registeredBy });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(500).json({ error: "Error adding visitor" });
  }
};

// Update visitor details
exports.updateVisitor = async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVisitor) return res.status(404).json({ error: "Visitor not found" });
    res.status(200).json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ error: "Error updating visitor" });
  }
};

// Delete a visitor record
exports.deleteVisitor = async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) return res.status(404).json({ error: "Visitor not found" });
    res.status(200).json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting visitor" });
  }
};
