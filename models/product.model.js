module.exports = (sequelize, Sequelize) =>{
    const Product = sequelize.define("product", {
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
        cost: {
            type: Sequelize.INTEGER,
            allowNull : false,
        }
    })
    return Product
}