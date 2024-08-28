const express = require("express");
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  mapAssetWithEmployee,
  returnAssetToAdmin
} = require("../controllers/assetController");
const {
  getAllAssetsMaintenance,
  getAssetByIdMaintenance,
  createAssetMaintenance,
  updateAssetMaintenance,
  deleteAssetMaintenance,
} = require("../controllers/assetMaintenanceController");

const router = express.Router();

// Asset routes
router.get("/get_all_assets", getAllAssets);
router.get("/get_asset/:id", getAssetById);
router.post("/create_asset", createAsset);
router.put("/update_asset/:id", updateAsset);
router.delete("/delete_asset/:id", deleteAsset);
router.post("/map_asset_with_employee", mapAssetWithEmployee);
router.post("/return_asset_to_admin", returnAssetToAdmin);

// Asset Maintenance routes
router.get("/get_all_assets_for_maintenance", getAllAssetsMaintenance);
router.get("/get_asset_maintenance/:id", getAssetByIdMaintenance);
router.post("/create_asset_for_maintenance", createAssetMaintenance);
router.put("/update_asset_for_maintenance/:id", updateAssetMaintenance); // Fixed typo
router.delete("/delete_asset_maintenance/:id", deleteAssetMaintenance); // Differentiated the delete route

module.exports = router;
