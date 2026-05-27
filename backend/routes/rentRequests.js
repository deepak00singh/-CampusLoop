const express = require('express');
const router = express.Router();
const RentRequest = require('../models/RentRequest');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

// Request bhejo
router.post('/send', authMiddleware, async (req, res) => {
    try {
        const { itemId, message, startDate, endDate } = req.body;

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (!item.isAvailable) return res.status(400).json({ message: 'Item not available' });
        if (item.owner.toString() === req.userId) return res.status(400).json({ message: 'You cannot rent your own item!' });

        const request = new RentRequest({
            item: itemId,
            requester: req.userId,
            owner: item.owner,
            message,
            startDate,
            endDate
        });

        await request.save();
        res.status(201).json({ message: 'Request sent successfully!', request });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Owner — incoming requests dekho
router.get('/incoming', authMiddleware, async (req, res) => {
    try {
        const requests = await RentRequest.find({ owner: req.userId })
            .populate('item', 'title pricePerDay')
            .populate('requester', 'naam email collegeName')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Owner — request accept karo
router.put('/accept/:id', authMiddleware, async (req, res) => {
    try {
        const request = await RentRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.owner.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

        request.status = 'accepted';
        await request.save();

        res.json({ message: 'Request accepted!', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Owner — deal confirm karo
router.put('/confirm/:id', authMiddleware, async (req, res) => {
    try {
        const request = await RentRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.owner.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

        // Deal confirm — baaki sab decline
        request.status = 'confirmed';
        await request.save();

        await Item.findByIdAndUpdate(request.item, { isAvailable: false });

        await RentRequest.updateMany(
            { item: request.item, _id: { $ne: request._id }, status: 'pending' },
            { status: 'declined' }
        );

        res.json({ message: 'Deal confirmed!', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Owner — deal cancel karo
router.put('/cancel/:id', authMiddleware, async (req, res) => {
    try {
        const request = await RentRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.owner.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });

        request.status = 'cancelled';
        await request.save();

        // Item wapas available
        await Item.findByIdAndUpdate(request.item, { isAvailable: true });

        res.json({ message: 'Deal cancelled. Item available again!', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Meri requests — maine kisko bheja
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const requests = await RentRequest.find({ requester: req.userId })
            .populate('item', 'title pricePerDay')
            .populate('owner', 'naam email')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;