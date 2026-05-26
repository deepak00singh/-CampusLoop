const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected! ✅');
    })
    .catch((err) => {
        console.log('MongoDB Error:', err);
    });
// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

const rentRequestRoutes = require('./routes/rentRequests');
app.use('/api/rent', rentRequestRoutes);

const requestRoutes = require('./routes/requests');
app.use('/api/requests', requestRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'CampusLoop Backend Running! 🚀' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});