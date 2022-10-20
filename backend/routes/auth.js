const router = require('express').Router();
const authController = require('../controllers/authControler')

//Register
router.post('/register', authController.register);
//LOGIN
router.post('/login', authController.login);
//LOGOUT
router.post('/logout', authController.logout);
//Refresh token
router.post('/refresh', authController.refreshToken);

module.exports = router;