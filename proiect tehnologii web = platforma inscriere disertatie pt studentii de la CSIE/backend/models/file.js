//modelul de fisier care va fi folosit ptr stocarea fisierelor incarcare de utilizatori
module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        fileName: DataTypes.STRING, //nume 
        filePath: DataTypes.STRING, //path
        fileType: DataTypes.STRING, //tip
        uploadedBy: DataTypes.INTEGER //id utilizator
    });

    //asociere cu request
    File.associate = (models) => {
        File.belongsTo(models.Request, { foreignKey: 'requestId' });
    };

    return File;
};