require("dotenv").config();

const app = require("./app");

const connectDB =
    require("./config/db.config");

// CONNECT DATABASE
connectDB();

const PORT =
    process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});