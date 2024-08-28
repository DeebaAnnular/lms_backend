const db = require('../config/db'); // Adjust the path to your database configuration

class AccessCard {
    // Get all access cards
    static getAll() {
        const sql = 'SELECT * FROM access_cards';
        return db.execute(sql);
    }

    // Get access card by ID
    static getById(id) {
        const sql = 'SELECT * FROM access_cards WHERE access_card_id = ?';
        return db.execute(sql, [id]);
    }

    // Create a new access card
    static create(accessCard) {
        const sql = `
            INSERT INTO access_cards (
                card_type, 
                user_id,
                emp_name, 
                emp_id, 
                designation, 
                job_type, 
                role, 
                access_card_number, 
                issue_date, 
                return_date, 
                command
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        return db.execute(sql, [
            accessCard.card_type,
            accessCard.user_id,
            accessCard.emp_name,
            accessCard.emp_id,
            accessCard.designation,
            accessCard.job_type,
            accessCard.role,
            accessCard.access_card_number,
            accessCard.issue_date,
            accessCard.return_date,
            accessCard.command
        ]);
    }

    // Update an access card
    static update(id, accessCard) {
        const sql = `
            UPDATE access_cards SET 
                card_type = ?, 
                emp_name = ?, 
                emp_id = ?, 
                designation = ?, 
                job_type = ?, 
                role = ?, 
                access_card_number = ?, 
                issue_date = ?, 
                return_date = ?, 
                command = ?
            WHERE access_card_id = ?
        `;
        return db.execute(sql, [
            accessCard.card_type,
            accessCard.emp_name,
            accessCard.emp_id,
            accessCard.designation,
            accessCard.job_type,
            accessCard.role,
            accessCard.access_card_number,
            accessCard.issue_date,
            accessCard.return_date,
            accessCard.command,
            id
        ]);
    }

    // Delete an access card
    static delete(id) {
        const sql = 'DELETE FROM access_cards WHERE access_card_id = ?';
        return db.execute(sql, [id]);
    }
}

module.exports = AccessCard;
