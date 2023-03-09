module.exports = (sequelize, Sequelize) =>{
    const Cart = sequelize.define("cart", {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        totalProducts: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        totalCost: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    })
    return Cart
}