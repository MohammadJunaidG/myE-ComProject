const { hashSync, genSaltSync } = require("bcryptjs");

module.exports = (sequelize, Sequelize) =>{
    const User = sequelize.define("user", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull : false,
            unique: true,
            validate :{
                len: [2-16]
            }
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate :{
                isEmail: true
            }
        },
        password:{
            type: Sequelize.STRING,
            set(value){
                const salt = genSaltSync(12);
                const hash = hashSync(value, salt)
                this.setDataValue('password', hash)
            }
        }
    })
    return User
}