const {signup, signin} = require("../controllers/auth.controller")
const { verifySignup } = require("../middlewares")
const validateSignup = require("../middlewares/validateSignup")
const signupObj = require("../dto/userSignupObject")

module.exports =(app) =>{
    app.post(
        "/ecomm/api/v1/auth/signup", 
        [
            validateSignup(signupObj),
            verifySignup.checkRoleExisted,
            verifySignup.checkDuplicateUsernameOrEmail
        ], 
        signup
    )

    app.post(
        "/ecomm/api/v1/auth/signin", 
        signin
    )
}