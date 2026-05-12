const express =
    require("express");

const router =
    express.Router();

const UserController =
    require(
        "../controllers/user.controller"
    );

// GET USERS

router.get(
    "/",
    UserController.getUsers
);

// CREATE USER

router.post(
    "/",
    UserController.createUser
);

// UPDATE USER

router.put(
    "/:id",
    UserController.updateUser
);

// DELETE USER

router.delete(
    "/:id",
    UserController.deleteUser
);

module.exports =
    router;