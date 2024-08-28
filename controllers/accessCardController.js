const AccessCard = require('../models/accessCardModal'); 

// Create a new access card
exports.createAccessCard = async (req, res) => {
    try {
        const result = await AccessCard.create(req.body);
        res.status(201).json({ message: 'Access card created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Access card number already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Get all access cards
exports.getAllAccessCards = async (req, res) => {
    try {
        const [accessCards] = await AccessCard.getAll();
        res.status(200).json(accessCards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get access card by ID
exports.getAccessCardById = async (req, res) => {
    try {
        const [accessCard] = await AccessCard.getById(req.params.id);
        if (accessCard.length > 0) {
            res.status(200).json(accessCard[0]);
        } else {
            res.status(404).json({ message: 'Access card not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an access card
exports.updateAccessCard = async (req, res) => {
    try {
        const result = await AccessCard.update(req.params.id, req.body);
        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: 'Access card updated successfully' });
        } else {
            res.status(404).json({ message: 'Access card not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an access card
exports.deleteAccessCard = async (req, res) => {
    try {
        const result = await AccessCard.delete(req.params.id);
        if (result[0].affectedRows > 0) {
            res.status(200).json({ message: 'Access card deleted successfully' });
        } else {
            res.status(404).json({ message: 'Access card not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};