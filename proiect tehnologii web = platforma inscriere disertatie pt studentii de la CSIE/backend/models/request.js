//modelul ptr request
module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        status: {
            //starea cererii
            type: DataTypes.ENUM('waiting', 'aprobat', 'refuzat', 'finalizat', 'semnat'),
            defaultValue: 'waiting'
        },
        message: DataTypes.TEXT, //mesaj student catre profesor
        workTitle: DataTypes.STRING, //titlul lucrarii
        rejectionReason: DataTypes.TEXT //motivul refuzului
    });

    //definirea asocierilor
    Request.associate = (models) => {
        //cererea esye facuta de un student
        Request.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
        //cererea apartine unei sesiune de incriere
        Request.belongsTo(models.InscriptionSession, { foreignKey: 'sesiuneId', as: 'sesiune', onDelete: 'CASCADE' });
        //o cerere poate avea mai multe fisiere
        Request.hasMany(models.File, { foreignKey: 'requestId', as: 'files' });
    };

    return Request;
};