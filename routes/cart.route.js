const { 
    create, 
    update, 
    findOne, 
    destroy, 
    deleteCartItem 
} = require("../controllers/cart.controller")

const { authJwt } = require("../middlewares")


module.exports = (app) => {
    app.post(
        "/ecomm/api/v1/carts",
        [authJwt.verifyToken],
        create
    )
    app.put(
        "/ecomm/api/v1/carts", 
        [authJwt.verifyToken], 
        update
    )
    app.get(
        "/ecomm/api/v1/cart/:id", 
        [authJwt.verifyToken], 
        findOne
    )
    app.delete(
        "/ecomm/api/v1/carts/:cartId/products/:productId", 
        [authJwt.verifyToken], 
        deleteCartItem
    )
    app.delete(
        "/ecomm/api/v1/cart/:id",
        [authJwt.verifyToken],
        destroy
    )
}