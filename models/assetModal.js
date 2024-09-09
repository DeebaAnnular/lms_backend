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
            `INSERT INTO assets (
                asset_no, asset_type, brand_name, device_serial_number, asset_status, ram, rom, processor, ostype, 
                ms_office_installed, purchase_date, purchase_cost, admin_configuration, operational_status, comments, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                asset.asset_no || null,
                asset.asset_type || null,
                asset.brand_name || null,
                asset.device_serial_number || null,
                asset.asset_status,
                asset.ram || null,
                asset.rom || null,
                asset.processor || null,
                asset.ostype || null,
                asset.ms_office_installed || null,
                asset.purchase_date || null,
                asset.purchase_cost || null,
                asset.admin_configuration || null,
                asset.operational_status || null,
                asset.comments || null,
                asset.user_id || null
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
                purchase_date = ?, 
                purchase_cost = ?, 
                admin_configuration = ?, 
                operational_status = ?, 
                comments = ?, 
                user_id = ? 
            WHERE asset_id = ?`,
            [
                asset.asset_no || null,
                asset.asset_type || null,
                asset.brand_name || null,
                asset.device_serial_number || null,
                asset.asset_status,
                asset.ram || null,
                asset.rom || null,
                asset.processor || null,
                asset.ostype || null,
                asset.ms_office_installed || null,
                asset.purchase_date || null,
                asset.purchase_cost || null,
                asset.admin_configuration || null,
                asset.operational_status || null,
                asset.comments || null,
                asset.user_id || null,
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
                userId || null,
                empName || null,
                empId || null,
                issueDate || null,
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
                userId || null,
                empName || null,
                empId || null,
                returnDate || null,
                assetStatus,
                assetId
            ]
        );
    }
}

module.exports = Asset;
