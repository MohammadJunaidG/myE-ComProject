const jwt = require("jsonwebtoken");
const db = require("../models");
require("dotenv").config()

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        if (!token) {
            return res.status(400).send({
                message: "No token provided."
            })
        }
        let userId;
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).send({
                    message: "Unauthorized Access."
                })
            }
            userId = decoded.id
            const user = await db.user.findByPk(userId)
            req.user = user
            next();
        })
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ message: "Some internal error" + error.message })
    }
}


const isAdmin = async (req, res, next) => {
    if (req.user) {
        const userRole = await req.user.getRoles()
        for (let i = 0; i < userRole.length; i++) {
            if (userRole[i].name === "admin") {
                next();
                return;
            }
        }
    }
    res.status(403).send({ message: "Admin role required." })
    return;
}

const authJwt = {
    verifyToken,
    isAdmin
}
module.exports = authJwt