module.exports = (sequelize, Sequelize) =>{
    const Category = sequelize.define("category", {
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
        description: {
            type: Sequelize.STRING,
            allowNull : false,
        },
        totalProducts: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    })
    return Category
}