const { Sequelize } = require('sequelize');

const E = process.env
const sequelize = new Sequelize(E.DATABASE_NAME, E.DATABASE_USER, E.DATABASE_PASSWORD, {
    host: E.DATABASE_HOST,
    dialect: E.DATABASE_PROVIDER/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

async function databaseConnect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, databaseConnect }