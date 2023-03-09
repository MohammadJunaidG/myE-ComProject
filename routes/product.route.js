const {
    create,
    update,
    findOne,
    findAll,
    destroy,
    getProductsUnderCategory,
} = require("../controllers/product.controller")

const { authJwt } = require("../middlewares")

module.exports = (app) => {
    app.post(
        "/ecomm/api/v1/products", 
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        create
    )
    
    app.put(
        "/ecomm/api/v1/products/:id", 
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        update
    )
    
    app.delete(
        "/ecomm/api/v1/products/:id",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
         destroy
    )

    app.get(
        "/ecomm/api/v1/products/categoryId/:categoryId", 
        getProductsUnderCategory
    )

    app.get("/ecomm/api/v1/products", findAll)
    app.get("/ecomm/api/v1/products/:id", findOne)
}