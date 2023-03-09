const {
    create,
    update,
    findAll,
    findOne,
    destroy
} = require("../controllers/category.controller")
const { authJwt } = require("../middlewares")


module.exports = (app) => {
    app.post(
        "/ecomm/api/v1/categories",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        create
    )

    app.put(
        "/ecomm/api/v1/categories/:id",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        update
    )

    app.delete(
        "/ecomm/api/v1/categories/:id",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        destroy
    )

    app.get("/ecomm/api/v1/categories", findAll)
    app.get("/ecomm/api/v1/categories/:id", findOne)
}