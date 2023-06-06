const Joi = require('joi');

module.exports = (data) => {
   const schema =
      Joi.object({
         role: Joi.string().required(),
         email: Joi.string().required(),
         password: Joi.string().required(),
      })

   return schema.validate(data);
}
