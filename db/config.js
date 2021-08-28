require('dotenv').config()

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DATABASE_URL } = process.env

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres'
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres'
  },
  production: {
    dialect: 'postgres',
    url: DATABASE_URL,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
