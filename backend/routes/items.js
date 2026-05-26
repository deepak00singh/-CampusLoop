const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

// Item post karo — protected route
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description, pricePerDay, category } = req.body;

        const item = new Item({
            title,
            description,
            pricePerDay,
            category,
            owner: req.userId
        });

        await item.save();

        res.status(201).json({ message: 'Item added successfully!', item });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Saare items fetch karo
router.get('/all', async (req, res) => {
    try {
        const { category } = req.query;
        let filter = { isAvailable: true };

        if (category) {
            filter.category = category;
        }

        const items = await Item.find(filter)
            .populate('owner', 'naam collegeName')
            .sort({ createdAt: -1 });

        res.json({ items });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Single item detail
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('owner', 'naam collegeName email');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ item });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mere items
router.get('/my/items', authMiddleware, async (req, res) => {
    try {
        const items = await Item.find({ owner: req.userId })
            .sort({ createdAt: -1 });

        res.json({ items });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;