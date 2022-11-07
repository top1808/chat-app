const User = require('../models/user')

const userController = {
    getAll: async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.status(200).send(users);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

module.exports = userController;