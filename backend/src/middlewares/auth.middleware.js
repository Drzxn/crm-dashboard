const jwt = require("jsonwebtoken");

module.exports = async (
    req,
    res,
    next
) => {

    try {

        // GET TOKEN
        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {

            return res.status(401).json({

                message:
                    "No token provided",
            });
        }

        // EXTRACT TOKEN
        const token =
            authHeader.split(" ")[1];

        // VERIFY TOKEN
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // SAVE USER DATA
        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        res.status(401).json({

            message:
                "Invalid token",
        });
    }
};