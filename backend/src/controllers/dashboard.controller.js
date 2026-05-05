const dashboardService = require('../services/dashboard.service');

exports.getDashboard = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardData(
            req.user,
            req.query
        );

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};