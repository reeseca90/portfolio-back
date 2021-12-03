var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/resume', indexController.resume);

// POST/GET routes for PDF generator project
router.post('/pdf', indexController.makePdf);
router.get('/getpdf', indexController.getPdf);

module.exports = router;