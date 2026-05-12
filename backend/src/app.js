const express = require("express");

const cors = require("cors");

const app = express();

// =====================================
// IMPORT ROUTES
// =====================================

const authRoutes =
    require("./routes/auth.routes");

const userRoutes =
    require("./routes/user.routes");

const dashboardRoutes =
    require("./routes/dashboard.routes");

const leadRoutes =
    require("./routes/lead.routes");

const activityRoutes =
    require("./routes/activity.routes");

const reportsRoutes =
    require("./routes/reports.routes");

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:8080",
        credentials: true,
    })
);

// =====================================
// TEST ROUTE
// =====================================

app.get("/test", (req, res) => {

    res.json({
        success: true,
        message: "API working",
    });

});

// =====================================
// API ROUTES
// =====================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/leads",
    leadRoutes
);

app.use(
    "/api/activity",
    activityRoutes
);

app.use(
    "/api/reports",
    reportsRoutes
);

// =====================================

module.exports = app;