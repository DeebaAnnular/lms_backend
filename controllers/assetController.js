const Asset = require("../models/assetModal");
const { format } = require("date-fns");

exports.getAllAssets = async (req, res) => {
  try {
    const [assets] = await Asset.getAll();
    const formattedAssets = assets.map((asset) => {
      return {
        ...asset,
        purchase_date: format(new Date(asset.purchase_date), "yyyy-MM-dd"),
      };
    });

    res.status(200).json(formattedAssets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [asset] = await Asset.getById(id);
    if (asset.length > 0) {
      // Format the purchase_date to 'YYYY-MM-DD'
      asset[0].purchase_date = format(
        new Date(asset[0].purchase_date),
        "yyyy-MM-dd"
      );
      res.status(200).json(asset[0]);
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const result = await Asset.create(req.body);
    res.status(201).json({ message: "Asset created successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      // Handle duplicate entry error
      res.status(400).json({
        message:
          "Asset number already exists. Please provide a unique asset number.",
      });
    } else {
      // Handle other errors
      res.status(400).json({ error: error.message });
    }
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Asset.update(id, req.body);
    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: "Asset updated successfully" });
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Asset.delete(id);
    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: "Asset deleted successfully" });
    } else {
      res.status(404).json({ error: "Asset not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.mapAssetWithEmployee = async (req, res) => {
  try {
    const { asset_id, user_id, emp_name, emp_id, issue_date, asset_status } =
      req.body;

    // Validate required fields
    if (
      !asset_id ||
      !user_id ||
      !emp_name ||
      !emp_id ||
      !issue_date ||
      !asset_status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Call the method to update asset with employee details
    await Asset.mapAssetWithEmployee(
      asset_id,
      user_id,
      emp_name,
      emp_id,
      issue_date,
      asset_status
    );
    res.status(200).json({ message: "Asset issued successfully" });
  } catch (err) {
    console.error("Error updating asset:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

exports.returnAssetToAdmin = async (req, res) => {
  try {
    const { asset_id, user_id, emp_name, emp_id, return_date, asset_status } =
      req.body;

    // Validate required fields
    if (
      asset_id === undefined ||
      user_id === undefined ||
      emp_name === undefined ||
      emp_id === undefined ||
      return_date === undefined ||
      asset_status === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Additional validation for field types
    if (
      typeof asset_id !== "number" ||
      typeof user_id !== "number" ||
      typeof emp_name !== "string" ||
      typeof emp_id !== "string" ||
      typeof return_date !== "string" ||
      !Number.isInteger(asset_status)
    ) {
      return res.status(400).json({ message: "Invalid field types" });
    }

    // Call the method to update asset with employee details
    const result = await Asset.returnAssetToAdmin(
      asset_id,
      user_id,
      emp_name,
      emp_id,
      return_date,
      asset_status
    );

    // Check if the update was successful
    if (result[0].affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Asset not found or no changes made" });
    }

    res.status(200).json({ message: "Asset received successfully" });
  } catch (err) {
    console.error("Error updating asset:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
