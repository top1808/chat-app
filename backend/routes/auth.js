const router = require('express').Router();
const authController = require('../controllers/authControler');
const middlewareController = require('../controllers/middlewareController');

//Register
router.post('/register', authController.register);
//LOGIN
router.post('/login', authController.login);
//LOGOUT
router.post('/logout', middlewareController.verifyToken, authController.logout);
//Refresh token
router.get('/refresh', authController.refreshToken);

module.exports = router;