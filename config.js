require('dotenv').config()

const userDB = process.env.DB_USER || 'root';
const passwordDB = process.env.DB_PWD || 'root';
const nameDB = process.env.DB_NAME || 'aisland';
const hostDB = process.env.DB_HOST || '127.0.0.1'
const URL = 'https://openmarket.ae';
const path = __dirname;

module.exports = { userDB, passwordDB, nameDB, hostDB, URL, path }