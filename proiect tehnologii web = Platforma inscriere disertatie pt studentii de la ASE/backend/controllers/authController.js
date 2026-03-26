//import de model user si librariile de securitate(parole + token)
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//functia pentru intregistrarea unui utilizator nou
exports.register = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, role,
            matriculationYear, educationForm, studyYear, specialization
        } = req.body;

        //se cripteaza parola ptr a fi salvata in baza de date
        const hashedPassword = await bcrypt.hash(password, 10);

        //se creaza un nou utilizator 
        const user = await User.create({
            firstName, lastName, email, role,
            matriculationYear, educationForm, studyYear, specialization,
            password: hashedPassword
        });
        res.status(201).json({ message: "Utilizatorul a fost creat cu succes!", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//functia pentru logarea utilizator
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //se cauta utilizatorul in baza 
        const user = await User.findOne({ where: { email } });

        //se verifica daca acesta exista si daca parola e corecta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Email sau parola incorecta!" });
        }


        //se genereaza un token valabil 24h
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        //returneaza raspunsul cu datele despre user si token
        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                matriculationYear: user.matriculationYear,
                educationForm: user.educationForm,
                studyYear: user.studyYear,
                specialization: user.specialization
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//functia pentru actualizarea profilului studentului
exports.updateProfile = async (req, res) => {
    try {
        const { matriculationYear, educationForm, studyYear, specialization } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Utilizatorul nu a fost gasit!" });
        }

        // Actualizam datele
        user.matriculationYear = matriculationYear;
        user.educationForm = educationForm;
        user.studyYear = studyYear;
        user.specialization = specialization;

        await user.save();

        res.json({
            message: "Profil actualizat cu succes!",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                matriculationYear: user.matriculationYear,
                educationForm: user.educationForm,
                studyYear: user.studyYear,
                specialization: user.specialization
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};