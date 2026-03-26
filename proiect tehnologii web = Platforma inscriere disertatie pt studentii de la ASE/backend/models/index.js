//previne erorile de scriere si forteaza un cod cat mai curat 
'use strict';

const fs = require('fs'); //citeste fisierele de pe disc
const path = require('path'); //gestioneaza path
const Sequelize = require('sequelize'); //importa libraria sequelize ORM
const process = require('process'); //acces la procese si variabilele de mediu
const basename = path.basename(__filename); //obtine numele fisierului curent
const env = process.env.NODE_ENV || 'development'; //stabileste mediul de lucru
const config = require(__dirname + '/../config/database.js')[env]; //incarca setarile din config/database.js
const db = {}; //unde se stocheaza User,Request etc

//creaza conexiunea la baza de date 
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//citeste automat toate fisierele din models si le importa
fs
  .readdirSync(__dirname)
  .filter(file => {
    //pastreaza doar fisierele .js si ignora index.js
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    //fiecare fisier gasit = importat ca Sequelize 
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

//parcurge toate modelele incarcate si stabileste relatiile intre ele (user hasMany Request)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; //exporta instanta de conexiune
db.Sequelize = Sequelize; //exporta libraria sequelize 

module.exports = db;
