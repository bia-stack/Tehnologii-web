//import model file si request necesare ptr realizarea de upload
const { File, Request } = require('../models');

//functia 'uploadFile' peimeste ca paramtrii request si response
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        //extrage id si tipul de fisier din body
        const { requestId, fileType } = req.body;

        //creaza fisier nou in baza de date
        const newFile = await File.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: fileType,
            requestId: requestId,
            uploadedBy: req.user.id
        });

        //returneaza un mesaj de succes si noul fisier
        res.status(201).json({
            message: "File uploaded successfully!",
            file: newFile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
