//analog fileController
const { Request, User, InscriptionSession, File } = require('../models');

//creaza o noua cerere de inscriere
exports.createRequest = async (req, res) => {
    try {
        const { sesiuneId, message, workTitle } = req.body;

        // Verificam daca mai sunt locuri disponibile (studenti aprobati)
        const sesiune = await InscriptionSession.findByPk(sesiuneId);
        if (!sesiune) {
            return res.status(404).json({ error: "Sesiunea nu exista." });
        }

        const nrAprobati = await Request.count({
            where: {
                sesiuneId: sesiuneId,
                status: ['aprobat', 'finalizat', 'semnat']
            }
        });

        if (nrAprobati >= sesiune.maxStudents) {
            return res.status(400).json({ error: "Aceasta sesiune nu mai are locuri disponibile." });
        }

        //creaza o noua cerere de inscriere in baza de date
        const newRequest = await Request.create({
            sesiuneId, //id sesiune
            message, //mesaj
            workTitle, //titlu lucrare disertatie
            studentId: req.user.id //id student
        });


        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//returneaza toate cererile studentului
exports.getStudentRequests = async (req, res) => {
    try {
        const cereri = await Request.findAll({
            where: { studentId: req.user.id },
            include: [
                {
                    model: InscriptionSession,
                    as: 'sesiune',
                    include: [{ model: User, as: 'profesor', attributes: ['firstName', 'lastName'] }]
                },
                { model: File, as: 'files' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(cereri);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//returneaza toate cererile profesorului
exports.getProfessorRequests = async (req, res) => {
    try {
        const profId = Number(req.user.id);


        const toateCererile = await Request.findAll({
            include: [
                { model: InscriptionSession, as: 'sesiune' },
                { model: User, as: 'student', attributes: ['firstName', 'lastName', 'email'] },
                { model: File, as: 'files' }
            ]
        });

        //arata profesorului care cereri sunt adresate doar lui
        const cereriFiltrate = toateCererile.filter(c => {
            return c.sesiune && Number(c.sesiune.profesorId) === profId;
        });

        res.json(cereriFiltrate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//actualizare cerere
exports.updateRequestStatus = async (req, res) => {
    try {
        const { stadiu, rejectionReason } = req.body;
        const cerere = await Request.findByPk(req.params.id, {
            include: [{ model: InscriptionSession, as: 'sesiune' }]
        });

        if (!cerere) return res.status(404).json({ error: "Cererea nu a fost gasita" });

        if (stadiu === 'aprobat') {
            const studentDejaAcceptat = await Request.findOne({
                where: {
                    studentId: cerere.studentId,
                    status: ['aprobat', 'finalizat', 'semnat'],
                    id: { [require('sequelize').Op.ne]: cerere.id }
                }
            });

            if (studentDejaAcceptat) {
                return res.status(400).json({ error: "Studentul este deja acceptat la alta sesiune!" });
            }

            const numarAprobati = await Request.count({
                where: {
                    sesiuneId: cerere.sesiuneId,
                    status: ['aprobat', 'finalizat', 'semnat'],
                    id: { [require('sequelize').Op.ne]: cerere.id }
                }
            });

            if (numarAprobati >= cerere.sesiune.maxStudents) {
                return res.status(400).json({ error: "Nu mai sunt locuri disponibile in aceasta sesiune." });
            }

            // Sterge automat celelalte cereri in asteptare ale studentului
            const Op = require('sequelize').Op;
            await Request.destroy({
                where: {
                    studentId: cerere.studentId,
                    status: 'waiting',
                    id: { [Op.ne]: cerere.id } // pastram cererea curenta pe care o aprobam
                }
            });
        }

        cerere.status = stadiu;
        if (rejectionReason !== undefined) {
            cerere.rejectionReason = rejectionReason;
        }
        await cerere.save();

        res.json({ message: `Cererea a fost ${stadiu} cu succes` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//incarcare document
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nu a fost incarcat niciun fisier." });
        }

        const cerere = await Request.findByPk(req.params.id);
        if (!cerere) {
            return res.status(404).json({ error: "Cererea nu a fost gasita." });
        }

        //adauga fisier in baza de date
        await File.create({
            fileName: req.file.originalname, //nume 
            filePath: req.file.path, //path
            fileType: req.file.mimetype, //tip 
            requestId: cerere.id, // id cerere
            uploadedBy: req.user.id //id student
        });

        cerere.status = 'finalizat';
        cerere.rejectionReason = null;
        await cerere.save();

        res.json({ message: "Fisierul a fost incarcat cu succes!" });
    } catch (error) {
        console.error("Eroare la incarcarea documentului!:", error);
        res.status(500).json({ error: error.message });
    }
};

//semanre document
exports.signRequest = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nu a fost incarcat niciun fisier semnat." });
        }

        //gasete cererea in functie de id
        const cerere = await Request.findByPk(req.params.id);
        if (!cerere) return res.status(404).json({ error: "Cererea nu a fost gasita" });

        await File.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            requestId: cerere.id,
            uploadedBy: req.user.id
        });

        cerere.status = 'semnat';
        await cerere.save();

        res.json({ message: "Documentul semnat a fost incarcat cu succes!" });
    } catch (error) {
        console.error("Eroare la semnare:", error);
        res.status(500).json({ error: error.message });
    }
};

//stergere cerere student
exports.deleteStudentRequest = async (req, res) => {
    try {
        const cerere = await Request.findOne({
            where: {
                id: req.params.id,
                studentId: req.user.id
            }
        });

        if (!cerere) {
            return res.status(404).json({ error: "Cererea nu a fost gasita" });
        }

        await cerere.destroy();
        res.json({ message: "Solicitarea a fost anulata cu succes!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
