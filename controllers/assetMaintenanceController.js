const AssetMaintenance = require('../models/assetMaintanenceModal');

exports.getAllAssetsMaintenance = async (req, res) => {
  try {
    const [rows] = await AssetMaintenance.getAll();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssetByIdMaintenance = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await AssetMaintenance.getById(id);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Asset not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAssetMaintenance = async (req, res) => {
  try {
    const newAsset = req.body;
    await AssetMaintenance.create(newAsset);
    res.status(201).json({ message: 'Asset maintenance list created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssetMaintenance = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAsset = req.body;
    await AssetMaintenance.update(id, updatedAsset);
    res.status(200).json({ message: 'Asset updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAssetMaintenance = async (req, res) => {
  try {
    const id = req.params.id;
    await AssetMaintenance.delete(id);
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};