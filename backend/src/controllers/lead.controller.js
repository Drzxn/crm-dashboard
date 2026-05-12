const Lead = require('../models/lead.model');

exports.getLeads = async (req, res) => {

    try {

        const leads = await Lead.find()
            .populate('ownerId', 'name email role');

        res.json(leads);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};