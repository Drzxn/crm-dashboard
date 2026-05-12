const User =
    require("../models/user.model");

const bcrypt =
    require("bcryptjs");

// ======================================
// GET USERS
// ======================================

exports.getUsers =
    async (req, res) => {

        try {

            const users =
                await User.find()

                    .populate(
                        "managerId",
                        "name email"
                    )

                    .sort({
                        createdAt: -1,
                    });

            res.json(users);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to fetch users",
            });
        }
    };

// ======================================
// CREATE USER
// ======================================

exports.createUser =
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                role,
                managerId,
                status,
            } = req.body;

            // VALIDATION

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                return res.status(400).json({
                    message:
                        "All fields are required",
                });
            }

            // CHECK EXISTING USER

            const existingUser =
                await User.findOne({
                    email,
                });

            if (existingUser) {

                return res.status(400).json({
                    message:
                        "Email already exists",
                });
            }

            // HASH PASSWORD

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            // CREATE USER

            const user =
                await User.create({

                    name,

                    email,

                    password:
                        hashedPassword,

                    role,

                    status:
                        status || "active",

                    managerId:
                        managerId || null,
                });

            res.status(201).json({

                message:
                    "User created successfully",

                user,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to create user",
            });
        }
    };

// ======================================
// UPDATE USER
// ======================================

exports.updateUser =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const {
                name,
                email,
                role,
                status,
                managerId,
            } = req.body;

            const user =
                await User.findById(id);

            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found",
                });
            }

            user.name =
                name || user.name;

            user.email =
                email || user.email;

            user.role =
                role || user.role;

            user.status =
                status || user.status;

            user.managerId =
                managerId || null;

            await user.save();

            res.json({

                message:
                    "User updated successfully",

                user,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to update user",
            });
        }
    };

// ======================================
// DELETE USER
// ======================================

exports.deleteUser =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const user =
                await User.findById(id);

            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found",
                });
            }

            await User.findByIdAndDelete(
                id
            );

            res.json({
                message:
                    "User deleted successfully",
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    "Failed to delete user",
            });
        }
    };