const Lead = require('../models/lead.model');

exports.getRecentActivity = async (req, res) => {

    try {

        const activity = await Lead.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('ownerId', 'name');

        res.json(activity);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};