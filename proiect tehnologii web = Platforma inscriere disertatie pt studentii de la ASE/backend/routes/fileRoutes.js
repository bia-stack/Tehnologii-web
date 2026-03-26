const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

//creaza calea de upload
router.post('/upload', auth, upload.single('file'), fileController.uploadFile);

//exporta routerul
module.exports = router;
