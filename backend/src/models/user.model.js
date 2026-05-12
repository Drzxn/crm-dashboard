const mongoose =
    require("mongoose");

const userSchema =
    new mongoose.Schema(

        {

            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
                unique: true,
            },

            password: {
                type: String,
                required: true,
            },

            role: {
                type: String,
                enum: [
                    "admin",
                    "tl",
                    "sales",
                ],
                default: "sales",
            },

            // IMPORTANT FIX

            managerId: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                default: null,
            },

            status: {
                type: String,
                enum: [
                    "active",
                    "inactive",
                ],
                default: "active",
            },
        },

        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "User",
        userSchema
    );