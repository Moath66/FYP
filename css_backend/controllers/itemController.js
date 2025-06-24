const Item = require("../models/Item");
const Claim = require("../models/claim");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

const frontendBaseURL =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";

exports.createItem = async (req, res) => {
  try {
    const { name, description, imageUrl, value } = req.body;
    const userId = req.user.id;

    const newItem = new Item({
      name,
      description,
      imageUrl,
      value,
      owner: userId,
    });

    await newItem.save();

    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create item" });
  }
};

exports.getItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId).populate(
      "owner",
      "username email"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, description, imageUrl, value } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this item" });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.imageUrl = imageUrl || item.imageUrl;
    item.value = value || item.value;

    await item.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this item" });
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

exports.listItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.find({ owner: userId });

    res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to list items" });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.owner.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You cannot claim your own item" });
    }

    const claimId = uuidv4();
    const claimCode = uuidv4();

    const newClaim = new Claim({
      claimId,
      item: itemId,
      claimer: userId,
      claimCode: claimCode,
      status: "pending",
    });

    await newClaim.save();

    const encodedData = Buffer.from(
      JSON.stringify({ claimId: claimId, claimCode: claimCode })
    ).toString("base64");
    const scanUrl = `${frontendBaseURL}/scan-item?data=${encodedData}`;

    QRCode.toDataURL(scanUrl, (err, qrCodeDataURL) => {
      if (err) {
        console.error("Error generating QR code:", err);
        return res.status(500).json({ message: "Failed to generate QR code" });
      }

      res.status(201).json({
        message: "Claim initiated successfully",
        claimId: claimId,
        qrCode: qrCodeDataURL,
        scanUrl: scanUrl,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to initiate claim" });
  }
};

exports.verifyClaim = async (req, res) => {
  try {
    const { claimId, claimCode } = req.body;
    const userId = req.user.id;

    const claim = await Claim.findOne({
      claimId: claimId,
      claimCode: claimCode,
    }).populate("item");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.item.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this item" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Claim is not pending" });
    }

    claim.status = "verified";
    await claim.save();

    res.status(200).json({ message: "Claim verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify claim" });
  }
};

exports.transferItem = async (req, res) => {
  try {
    const { claimId } = req.body;
    const userId = req.user.id;

    const claim = await Claim.findOne({ claimId: claimId }).populate("item");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.item.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not the owner of this item" });
    }

    if (claim.status !== "verified") {
      return res.status(400).json({ message: "Claim is not verified" });
    }

    const item = await Item.findById(claim.item._id);
    item.owner = claim.claimer;
    await item.save();

    claim.status = "completed";
    await claim.save();

    res.status(200).json({ message: "Item transferred successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to transfer item" });
  }
};

exports.getAllClaimsForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all claims where the user is either the claimer or the owner of the item
    const claims = await Claim.find({
      $or: [
        { claimer: userId },
        { item: { $in: await Item.find({ owner: userId }).distinct("_id") } },
      ],
    }).populate("item claimer");

    res.status(200).json({ claims });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch claims for user" });
  }
};
