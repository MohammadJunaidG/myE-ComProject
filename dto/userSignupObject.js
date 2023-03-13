const yup = require('yup');

module.exports = yup.object().shape({
    username: yup.string().trim().required(),
    email: yup.string().required().email(),
    password: yup.string().required()
});