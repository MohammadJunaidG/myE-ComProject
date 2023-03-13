require("dotenv").config()
const dev = process.env
module.exports = {
    development: {
        HOST: dev.HOST,
        USER: dev.USER,
        PASSWORD: dev.PASSWORD,
        DB: dev.DB,
        dialect: dev.dialect,
        pool: {
            max: process.env.max,
            min: process.env.min,
            accquire: process.env.accquire,
            idle: process.env.idle
        }
    }
}