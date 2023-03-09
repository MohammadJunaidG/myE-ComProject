module.exports = {
    development :{
        HOST: "localhost",
        USER: "root",
        PASSWORD: "root@123456",
        DB: "demo",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            accquire: 30000,
            idle: 10000
        }
    }
}