const ApiError = require('../error/api-error');

function validateSignup(schema) {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body);
      // replace request body with validated schema object
      // so that default values are applied to the DTO (data transfer object)
      req.body = validatedBody;
      next();
    } catch (err) {
        const {code} = new ApiError(err)
        return res.status(400).json(code.errors)        
    }
  };
}

module.exports = validateSignup;