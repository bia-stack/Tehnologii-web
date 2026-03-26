//modelul pentru sesiunile de inscriere
module.exports = (sequelize, DataTypes) => {
    const InscriptionSession = sequelize.define('InscriptionSession', {
        title: {
            type: DataTypes.STRING,
            allowNull: false //camp obligatoriu
        },
        description: DataTypes.TEXT, //descreire cu lux de amamnunte

        startDate: {
            type: DataTypes.DATE,
            allowNull: false //data inceput
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false //data final
        },
        maxStudents: {
            type: DataTypes.INTEGER,
            defaultValue: 10 //nr max de studenti care pot fi inscrisi
        }
    });

    //definirea relatiilor
    InscriptionSession.associate = (models) => {
        //o sesiune apartine unui profesor
        InscriptionSession.belongsTo(models.User, { foreignKey: 'profesorId', as: 'profesor' });
        //o sesiune poate avea mai multe requesturi
        InscriptionSession.hasMany(models.Request, { foreignKey: 'sesiuneId', as: 'requests' });
    };

    return InscriptionSession;
};