//modelul de user
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false //nu poate fi NULL
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true //emailul trebuie sa fie unic
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('student', 'profesor'), //exista doar 2 roluri: student si profesor
            allowNull: false,
            default: 'student' //rolul default este student
        },
        matriculationYear: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        educationForm: {
            type: DataTypes.ENUM('IF', 'ID'),
            allowNull: true
        },
        studyYear: {
            type: DataTypes.ENUM('An 2', 'An suplimentar'),
            allowNull: true
        },
        specialization: {
            type: DataTypes.ENUM(
                'Baze de date',
                'Securitate Cibernetica',
                'Inteligenta artificiala',
                'Cercetare Info-eco',
                'Cibernetica si economie',
                'E-business',
                'Statistica aplicata si Data Science',
                'Ingineria Datelor'
            ),
            allowNull: true
        }
    });


    User.associate = (models) => {
        //un prof poate da mai multe sesiuni
        User.hasMany(models.InscriptionSession, { foreignKey: 'profesorId', as: 'sesiuni' });
        //un stundet poate face mai multe cereri
        User.hasMany(models.Request, { foreignKey: 'studentId', as: 'requests' });
    }

    return User;
};
