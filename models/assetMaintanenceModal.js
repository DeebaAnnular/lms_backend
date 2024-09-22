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
      `INSERT INTO asset_maintenance (asset_no, issue_description, service_cost, service_outdate, service_indate,comments,emp_name) 
      VALUES (?, ?, ?, ?, ?,?,?)`,
      [
        assetMaintenance.asset_no || null ,
        assetMaintenance.issue_description || null,
        assetMaintenance.service_cost || null,
        assetMaintenance.service_outdate || null,
        assetMaintenance.service_indate || null,
        assetMaintenance.comments || null,
        assetMaintenance.emp_name || null,
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
      emp_name = ?
      WHERE asset_service_id = ?`,
      [
        assetMaintenance.asset_no || null,
        assetMaintenance.issue_description || null,
        assetMaintenance.service_cost || null,
        assetMaintenance.service_outdate || null,
        assetMaintenance.service_indate || null,
        assetMaintenance.comments || null,
        assetMaintenance.emp_name || null,
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
