const db = require('../config/db'); 

class Asset {
    static getAll() {
      return db.execute('SELECT * FROM assets');
    }
  
    static getById(id) {
      return db.execute('SELECT * FROM assets WHERE asset_id = ?', [id]);
    }
  
    static create(asset) {
      return db.execute(
        `INSERT INTO assets (asset_no, asset_type, brand_name, device_serial_number, asset_status, ram, rom, processor, ostype, ms_office_installed, os_installed, purchase_date, purchase_cost, admin_configuration, operational_status, command, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          asset.asset_no,
          asset.asset_type,
          asset.brand_name,
          asset.device_serial_number,
          asset.asset_status,
          asset.ram,
          asset.rom,
          asset.processor,
          asset.ostype,
          asset.ms_office_installed,
          asset.os_installed,
          asset.purchase_date,
          asset.purchase_cost,
          asset.admin_configuration,
          asset.operational_status,
          asset.command,
          asset.user_id
        ]
      );
    }
  
    static update(id, asset) {
      return db.execute(
        `UPDATE assets SET 
        asset_no = ?, 
        asset_type = ?, 
        brand_name = ?, 
        device_serial_number = ?, 
        asset_status = ?, 
        ram = ?, 
        rom = ?, 
        processor = ?, 
        ostype = ?, 
        ms_office_installed = ?, 
        os_installed = ?, 
        purchase_date = ?, 
        purchase_cost = ?, 
        admin_configuration = ?, 
        operational_status = ?, 
        command = ?, 
        user_id = ? 
        WHERE asset_id = ?`,
        [
          asset.asset_no,
          asset.asset_type,
          asset.brand_name,
          asset.device_serial_number,
          asset.asset_status,
          asset.ram,
          asset.rom,
          asset.processor,
          asset.ostype,
          asset.ms_office_installed,
          asset.os_installed,
          asset.purchase_date,
          asset.purchase_cost,
          asset.admin_configuration,
          asset.operational_status,
          asset.command,
          asset.user_id,
          id
        ]
      );
    }
  
    static delete(id) {
      return db.execute('DELETE FROM assets WHERE asset_id = ?', [id]);
    }

    static mapAssetWithEmployee(assetId, userId, empName, empId, issueDate, assetStatus) {
      return db.execute(
        `UPDATE assets SET 
          user_id = ?, 
          emp_name = ?, 
          emp_id = ?, 
          issue_date = ?, 
          asset_status = ? 
        WHERE asset_id = ?`,
        [
          userId,
          empName,
          empId,
          issueDate,
          assetStatus,
          assetId
        ]
      );
    }

    static returnAssetToAdmin(assetId, userId, empName, empId, returnDate, assetStatus) {
      return db.execute(
        `UPDATE assets SET 
          user_id = ?, 
          emp_name = ?, 
          emp_id = ?, 
          return_date = ?, 
          asset_status = ? 
        WHERE asset_id = ?`,
        [
          userId,
          empName,
          empId,
          returnDate,
          assetStatus,
          assetId
        ]
      );
    }
  }
  

  
  module.exports = Asset;