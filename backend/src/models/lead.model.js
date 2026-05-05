const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: String,
    source: {
        type: String,
        enum: ['marketing', 'channel_partner', 'walk_in'],
    },
    stage: {
        type: String,
        enum: [
            'qualified',
            'need_analysis',
            'proposal',
            'negotiation',
            'bip',
            'cancellation',
            'closed_lost',
        ],
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);