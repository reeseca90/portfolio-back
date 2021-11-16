var express = require('express');
var router = express.Router();

const blogController = require('../controllers/blogController');



// login page GET
router.get('/login', blogController.login_get);

// login page POST
router.post('/login', blogController.login_post); 

// logout
router.post('/logout', blogController.logout);

module.exports = router;
