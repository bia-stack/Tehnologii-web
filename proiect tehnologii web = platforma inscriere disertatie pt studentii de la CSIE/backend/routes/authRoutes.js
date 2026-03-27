const express = require('express'); //importa express
const router = express.Router(); //creaza un router
const authController = require('../controllers/authController'); //importa controollerul
const autentiicare = require('../middleware/authMiddleware');

router.post('/register', authController.register); //creaza calea de register
router.post('/login', authController.login); //creaza calea de login
router.put('/profile', autentiicare, authController.updateProfile); //calea pentru actualizare profil
module.exports = router; //il exporta astfel incat aplicatia sa poata functiona