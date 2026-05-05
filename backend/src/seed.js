require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db.config");
const User = require("./models/user.model");
const Lead = require("./models/lead.model");

const seedData = async () => {
    try {
        await connectDB();

        // 🔥 Clear old leads
        await Lead.deleteMany();

        const users = await User.find();

        const admin = users.find(u => u.role === "admin");
        const tl = users.find(u => u.role === "tl");
        const salesUsers = users.filter(u => u.role === "sales");

        if (!admin || !tl || salesUsers.length === 0) {
            console.log("❌ Missing required users (admin, tl, sales)");
            process.exit();
        }

        const sources = ["marketing", "channel_partner", "walk_in"];

        const stages = [
            "qualified",
            "need_analysis",
            "proposal",
            "negotiation",
            "bip",
            "cancellation",
            "closed_lost"
        ];

        const leads = [];

        // 🔥 1. SALES LEADS (MOST IMPORTANT)
        for (let i = 0; i < 10; i++) {
            const salesUser = salesUsers[i % salesUsers.length];

            leads.push({
                name: `Sales Lead ${i + 1}`,
                source: sources[i % sources.length],
                stage: stages[i % stages.length],
                ownerId: salesUser._id   // ✅ FIXED
            });
        }

        // 🔥 2. TL LEADS
        for (let i = 0; i < 5; i++) {
            leads.push({
                name: `TL Lead ${i + 1}`,
                source: sources[Math.floor(Math.random() * sources.length)],
                stage: stages[Math.floor(Math.random() * stages.length)],
                ownerId: tl._id   // ✅ FIXED
            });
        }

        // 🔥 3. ADMIN LEADS
        for (let i = 0; i < 5; i++) {
            leads.push({
                name: `Admin Lead ${i + 1}`,
                source: sources[Math.floor(Math.random() * sources.length)],
                stage: stages[Math.floor(Math.random() * stages.length)],
                ownerId: admin._id   // ✅ FIXED
            });
        }

        await Lead.insertMany(leads);

        console.log("✅ Seeded 20 leads with correct structure");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();