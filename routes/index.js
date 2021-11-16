var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/experience/resume', indexController.resume);

module.exports = router;