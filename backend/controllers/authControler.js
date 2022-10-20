const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const authController = {
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '30s' }
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
                return res.status(404).json("Wrong username")
            }
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!isValidPassword) {
                return res.status(404).json("Wrong password")
            }
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                path: "/"
            })
            res.status(200).json({ user, accessToken });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    logout: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(404).json("You have not logged in yet");
            res.clearCookie('refreshToken');
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            res.status(200).json("Log out successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You are not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);
            //Create new token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                path: "/"
            })
            res.status(200).json({ newAccessToken });
        })
    }
}

module.exports = authController;