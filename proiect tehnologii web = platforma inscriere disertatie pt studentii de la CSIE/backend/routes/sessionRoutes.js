//creaza calea de getAllSessions
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', sessionController.getAllSessions);
router.post('/', auth, role('profesor'), sessionController.createSession);
router.delete('/:id', auth, role('profesor'), sessionController.deleteSession);

module.exports = router;
