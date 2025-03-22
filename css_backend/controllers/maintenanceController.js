const Maintenance = require("../models/Maintenance");

// Get all maintenance requests
exports.getAllMaintenanceRequests = async (req, res) => {
  try {
    const maintenanceRequests = await Maintenance.find().populate("reportedBy", "userName email");
    res.status(200).json(maintenanceRequests);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving maintenance requests" });
  }
};

// Get a single maintenance request by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate("reportedBy", "userName email");
    if (!maintenance) return res.status(404).json({ error: "Maintenance request not found" });
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving maintenance request" });
  }
};

// Create a new maintenance request
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { equipment_id, equipmentType, equipmentAge, usagePattern, environmentalCondition, description, reportedBy } = req.body;
    const newMaintenance = new Maintenance({ equipment_id, equipmentType, equipmentAge, usagePattern, environmentalCondition, description, reportedBy });
    await newMaintenance.save();
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(500).json({ error: "Error adding maintenance request" });
  }
};

// Update a maintenance request
exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMaintenance) return res.status(404).json({ error: "Maintenance request not found" });
    res.status(200).json(updatedMaintenance);
  } catch (error) {
    res.status(500).json({ error: "Error updating maintenance request" });
  }
};

// Delete a maintenance request
exports.deleteMaintenanceRequest = async (req, res) => {
  try {
    const deletedMaintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deletedMaintenance) return res.status(404).json({ error: "Maintenance request not found" });
    res.status(200).json({ message: "Maintenance request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting maintenance request" });
  }
};
