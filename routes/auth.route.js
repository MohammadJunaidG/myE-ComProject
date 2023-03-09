const {signup, signin} = require("../controllers/auth.controller")
const { verifySignup } = require("../middlewares")

module.exports =(app) =>{
    app.post(
        "/ecomm/api/v1/auth/signup",
        [
            verifySignup.validateSignupRequestBody,
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