const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');

// Request post karo — "Mujhe ye chahiye"
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const request = new Request({
            title,
            description,
            category,
            requestedBy: req.userId
        });

        await request.save();
        res.status(201).json({ message: 'Request posted successfully!', request });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Saari requests dekho
router.get('/all', async (req, res) => {
    try {
        const requests = await Request.find({ isResolved: false })
            .populate('requestedBy', 'naam collegeName')
            .sort({ createdAt: -1 });

        res.json({ requests });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Kisi request pe respond karo
router.post('/respond/:id', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.requestedBy.toString() === req.userId) {
            return res.status(400).json({ message: 'Apni request pe respond nahi kar sakte!' });
        }

        request.responses.push({
            responder: req.userId,
            message
        });

        await request.save();
        res.json({ message: 'Response sent successfully!', request });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request resolve karo
router.put('/resolve/:id', authMiddleware, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.requestedBy.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        request.isResolved = true;
        await request.save();
        res.json({ message: 'Request resolved!', request });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Meri requests
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const requests = await Request.find({ requestedBy: req.userId })
            .sort({ createdAt: -1 });

        res.json({ requests });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;