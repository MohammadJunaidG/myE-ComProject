const db = require("../models")
const Role = db.role;
const User = db.user;

const validateSignupRequestBody = (req, res, next) => {
    let { username, email, password } = req.body
    if (!username || !email) {
        return res.status(400).send({ message: "Email or username can not be empty." })
    }
    if (!password) {
        return res.status(400).send({ message: "Password not provided." })
    }
    next();
}

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const {username, email } = req.body
    let user = await User.findOne({where: {username: username}})
    if(user) return res.status(404).send({
        message: "Username already exists."
    })
    user = await User.findOne({where: {email: email}})    
    if(user) return res.status(404).send({
        message: "Email already exists."
    })
    next();    
}

const checkRoleExisted = (req, res, next) => {
    const roles = req.body.roles;
    if (roles) {
        //iterate through roles provided by user
        roles.forEach(role => {
            Role.findAll({
                where: {
                    name: role
                }
            }).then(userRole => {
                console.log(userRole);
                    if (!userRole.length) {
                    return res.status(404).send({
                        message: "User Role [" + role + "] doesn't exists."
                    })
                }
            })
        })
   
    }
    next();
};

const verifySignup = {
    validateSignupRequestBody,
    checkDuplicateUsernameOrEmail,
    checkRoleExisted,
} 
module.exports = verifySignup
