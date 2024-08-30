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
        let sql = `
            INSERT INTO access_cards (
                card_type, 
                emp_name, 
                emp_id, 
                designation, 
                role, 
                access_card_number, 
                issue_date, 
                return_date, 
                comments
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        let params = [
            accessCard.card_type,
            accessCard.emp_name,
            accessCard.emp_id,
            accessCard.designation,
            accessCard.role,
            accessCard.access_card_number,
            accessCard.issue_date,
            accessCard.return_date,
            accessCard.comments
        ];
    
        // Add user_id to the query only if it's provided
        if (accessCard.user_id) {
            sql = sql.replace('INSERT INTO access_cards (', 'INSERT INTO access_cards (user_id, ');
            sql = sql.replace('VALUES (', 'VALUES (?, ');
            params.unshift(accessCard.user_id);
        }
    
        return db.execute(sql, params);
    }
    // Update an access card
    static update(id, accessCard) {
        const sql = `
            UPDATE access_cards SET 
                card_type = ?, 
                emp_name = ?, 
                emp_id = ?, 
                designation = ?, 
                role = ?, 
                access_card_number = ?, 
                issue_date = ?, 
                return_date = ?, 
                comments = ?
            WHERE access_card_id = ?
        `;
        return db.execute(sql, [
            accessCard.card_type,
            accessCard.emp_name,
            accessCard.emp_id,
            accessCard.designation,
            accessCard.role,
            accessCard.access_card_number,
            accessCard.issue_date,
            accessCard.return_date,
            accessCard.comments,
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
