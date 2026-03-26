// analog cu requestController
const { InscriptionSession, User, Request } = require('../models');
const { Op } = require('sequelize');

//creare seiune de disertatie
exports.createSession = async (req, res) => {
    try {
        const { title, desc, startDate, endDate, maxStud } = req.body;

        //verificare daca exista deja o sesiune in acelasi interval de timp
        const sesiuneExistenta = await InscriptionSession.findOne({
            where: {
                profesorId: req.user.id,
                [Op.or]: [
                    {
                        startDate: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        endDate: { [Op.between]: [startDate, endDate] }
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]: startDate } },
                            { endDate: { [Op.gte]: endDate } }
                        ]
                    }
                ]
            }
        });

        if (sesiuneExistenta) {
            return res.status(400).json({ error: "Aveti deja o sesiune programata in acest interval" });
        }


        const sesiune = await InscriptionSession.create({
            title,
            description: desc,
            startDate,
            endDate,
            maxStudents: maxStud,
            profesorId: req.user.id
        });

        res.status(201).json(sesiune);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//aduce pe panoul prof toate sesiunile
exports.getAllSessions = async (req, res) => {
    try {
        const sesiuni = await InscriptionSession.findAll({
            include: [{ model: User, as: 'profesor', attributes: ['firstName', 'lastName'] }]
        });

        // Adaugam numarul de studenti aprobati pentru fiecare sesiune
        const sesiuniCuLocuri = await Promise.all(sesiuni.map(async (s) => {
            const nrAprobati = await Request.count({
                where: {
                    sesiuneId: s.id,
                    status: ['aprobat', 'finalizat', 'semnat']
                }
            });
            return {
                ...s.toJSON(),
                nrAprobati
            };
        }));

        res.json(sesiuniCuLocuri);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//sterge sesiune
exports.deleteSession = async (req, res) => {
    try {
        const sesiune = await InscriptionSession.findOne({
            where: {
                id: req.params.id,
                profesorId: req.user.id
            }
        });

        if (!sesiune) {
            return res.status(404).json({ error: "Sesiunea nu a fost gasita sau nu aveti permisiunea sa o stergeti." });
        }

        await Request.destroy({ where: { sesiuneId: sesiune.id } });

        await sesiune.destroy();
        res.json({ message: "Sesiunea a fost stearsa cu succes!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
