const express = require('express');

const router = express.Router();

const activityController = require('../controllers/activity.controller');

// GET RECENT ACTIVITY
router.get('/', activityController.getRecentActivity);

module.exports = router;