module.exports = (sequelize, Sequelize) =>{
    const Role = sequelize.define("role", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull : false,
            unique: true,
            validate :{
                len: [2-16]
            }
        },
        totalUsers: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    })
    return Role
}