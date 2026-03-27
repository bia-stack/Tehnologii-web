const multer = require('multer'); //middleware care permite aplicatiei sa gestioneze fiserele trimise de utilizator
const path = require('path'); //modul care ajuta la lucrul cu pathuri

//configureaza multer:locul de stocare si nume fisier
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // fisierele se vor salva in folderul 'backend/uploads'
    },
    filename: (req, file, cb) => {

        //genereaza nume unice ptr fisiere folosind data curenta si un nr random
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

//reda tipurile de fisier permise de upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();

    //verifica daca tipul de fisier dat este permis
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Your file doesn`t meet the required criteria!'), false);
    }
};

//seteaza limita de MB ptr incarcare
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

//permite utilizarea functiei de incarcare de catre aplicatie
module.exports = upload;
