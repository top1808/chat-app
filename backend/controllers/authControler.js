const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');

const authController = {
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '10s' }
        )
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: '300d'}
        );
    },
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
            });
            const savedUser = await user.save();
            res.status(200).json(savedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).send({ message: "Wrong username" });
            }
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!isValidPassword) {
                return res.status(404).send({ message: "Wrong password" });
            }
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            console.log("🚀 refreshToken 1", refreshToken)
            req.session.refreshToken = refreshToken;
            await redisClient.set('refreshTokens', refreshToken);
            res.status(200).send({ user, accessToken });
        } catch (err) {
            res.status(500).send(err);
        }
    },
    logout: async (req, res) => {
        try {
            req.session.refreshToken = "";
            await redisClient.set('refreshTokens', '');
            res.status(200).send({ message: "Log out successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.session.refreshToken;
        console.log("🚀 ~ req.session", req.session)
        console.log("🚀 refreshToken 2", refreshToken)
        if (!refreshToken) return res.status(401).json("You are not authenticated");

        await redisClient.get('refreshTokens', async (err, value) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                if (value !== refreshToken) {
                    return res.status(403).send({ message: "Refresh token is not valid", value, refreshToken });
                }
                jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    //Create new token
                    const newAccessToken = authController.generateAccessToken(user);
                    const newRefreshToken = authController.generateRefreshToken(user);

                    req.session.refreshToken = newRefreshToken;

                    await redisClient.set('refreshTokens', newRefreshToken);

                    res.status(200).json({ newAccessToken });
                })
            }
        })

        
    }
}

module.exports = authController;