const router = require('express').Router();
const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

//GET all
router.get('/', middlewareController.verifyToken, userController.getAll);

module.exports = router;