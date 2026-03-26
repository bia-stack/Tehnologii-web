const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const upload = require('../middleware/uploadMiddleware');

//creaza calea de createRequest
router.post('/', auth, role('student'), requestController.createRequest);
//creaza calea de getStudentRequests
router.get('/my-requests', auth, role('student'), requestController.getStudentRequests);
//creaza calea de deleteStudentRequest
router.delete('/:id', auth, role('student'), requestController.deleteStudentRequest);
//creaza calea de uploadDocument
router.post('/:id/upload', auth, role('student'), upload.single('document'), requestController.uploadDocument);
//creaza calea de getProfessorRequests
router.get('/professor', auth, role('profesor'), requestController.getProfessorRequests);
router.put('/:id', auth, role('profesor'), requestController.updateRequestStatus);
router.put('/:id/sign', auth, role('profesor'), upload.single('document'), requestController.signRequest);

module.exports = router;
