const Lead = require('../models/lead.model');
const User = require('../models/user.model');
const mongoose = require("mongoose");

exports.getDashboardData = async (user, filters) => {
    let query = {};
    const userId = new mongoose.Types.ObjectId(user.id);

    // 🔵 SALES → only own leads
    if (user.role === 'sales') {
        query.ownerId = userId;
    }

    // 🟡 TL → own leads + team leads
    else if (user.role === 'tl') {
        const teamMembers = await User.find({
            managerId: userId
        }).select('_id');

        const teamIds = teamMembers.map(u => u._id);

        query.ownerId = {
            $in: [userId, ...teamIds]
        };
    }

    // 🟢 ADMIN → no filter (all leads)

    // 🔎 SOURCE FILTER
    if (filters.source) {
        const allowedSources = ['marketing', 'channel_partner', 'walk_in'];

        // validate to avoid garbage input
        if (!allowedSources.includes(filters.source)) {
            throw new Error('Invalid source filter');
        }

        query.source = filters.source;
    }

    // 📅 TIME FILTER (robust, non-mutating)
    if (filters.time) {
        const now = new Date();

        let startDate = null;
        let endDate = null;

        switch (filters.time) {
            case 'today': {
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
                break;
            }

            case 'week': {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                break;
            }

            case 'month': {
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            }

            case '90days': {
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 90);
                break;
            }

            case 'year': {
                startDate = new Date(now);
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            }

            default:
                throw new Error('Invalid time filter');
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.createdAt = { $gte: startDate };
        }
    }

    const stats = await Lead.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$stage",
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        total: 0,
        qualified: 0,
        need_analysis: 0,
        proposal: 0,
        negotiation: 0,
        bip: 0,
        cancellation: 0,
        closed_lost: 0,
    };

    stats.forEach(item => {
        if (result.hasOwnProperty(item._id)) {
            result[item._id] = item.count;
            result.total += item.count;
        }
    });

    return result;
}