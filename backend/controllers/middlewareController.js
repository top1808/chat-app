const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
                if (err) {
                    res.status(500).send({ message: "Token is not valid" });
                } else {
                    req.user = user;
                    next();
                }
            })
        } else {
            res.status(401).send({ message: "You are not authenticated" });
        }
    },
}

module.exports = middlewareController;