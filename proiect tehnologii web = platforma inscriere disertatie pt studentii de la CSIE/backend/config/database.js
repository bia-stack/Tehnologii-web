//incarca variabilele din fisierul .env
require('dotenv').config();

//configurarea baze de date relationala pentru sequelize ORM - se foloseste PostgreSQL 
module.exports = {

  //configurari ptr baza de date
  development: {
    username: process.env.DB_USER,      //usernameul utilizatoru
    password: process.env.DB_PASSWORD,  //parola 
    database: process.env.DB_NAME,      // numele bazei da date
    host: process.env.DB_HOST,          //adresa seerverului
    port: process.env.DB_PORT || 5432,  //portul de conectare
    dialect: 'postgres',                //dialectul ORM
    logging: console.log,               //se activeaza comenzile sql
  },

  //configurar ptr baza de date
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,                     //se dezactiveaza comenzile sql ptr crearea tabelelor


    //Optiune ptr utilizarea unui url de conexiune direct din var de mediu
    use_env_variable: 'DATABASE_URL',

    //optiune pentru conexiune securizata in cloud
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false //permite posibilitatea conexiunii chiar daca nu are certificat      
      }
    }
  }
};