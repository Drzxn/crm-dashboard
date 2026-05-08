// backend/src/app.js

const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth.routes');

const userRoutes = require("./routes/user.routes");

const dashboardRoutes = require("./routes/dashboard.routes");

// middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// test route
app.get('/test', (req, res) => {
    res.json({ message: 'API working' });
});

module.exports = app;



