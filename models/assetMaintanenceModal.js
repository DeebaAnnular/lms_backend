const db = require("../config/db");

class AssetMaintenance {
  static getAll() {
    return db.execute("SELECT * FROM asset_maintenance");
  }

  static getById(id) {
    return db.execute(
      "SELECT * FROM asset_maintenance WHERE asset_service_id = ?",
      [id]
    );
  }

  static create(assetMaintenance) {
    return db.execute(
      `INSERT INTO asset_maintenance (asset_no, issue_description, service_cost, service_outdate, service_indate,comments) 
      VALUES (?, ?, ?, ?, ?,?)`,
      [
        assetMaintenance.asset_no,
        assetMaintenance.issue_description,
        assetMaintenance.service_cost,
        assetMaintenance.service_outdate,
        assetMaintenance.service_indate,
        assetMaintenance.comments,
      ]
    );
  }

  static update(id, assetMaintenance) {
    return db.execute(
      `UPDATE asset_maintenance SET 
      asset_no = ?, 
      issue_description = ?, 
      service_cost = ?, 
      service_outdate = ?, 
      service_indate = ? ,
      comments = ?,
      WHERE asset_service_id = ?`,
      [
        assetMaintenance.asset_no,
        assetMaintenance.issue_description,
        assetMaintenance.service_cost,
        assetMaintenance.service_outdate,
        assetMaintenance.service_indate,
        assetMaintenance.comments,
        id,
      ]
    );
  }

  static delete(id) {
    return db.execute(
      "DELETE FROM asset_maintenance WHERE asset_service_id = ?",
      [id]
    );
  }
}

module.exports = AssetMaintenance;
