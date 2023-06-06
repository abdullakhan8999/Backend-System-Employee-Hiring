const Joi = require('joi');

module.exports = (data) => {
   const schema = data.role === 'student' ?
      (Joi.object({
         firstName: Joi.string().required(),
         lastName: Joi.string().required(),
         phone: Joi.string().required(),
         email: Joi.string().required(),
         role: Joi.string().required(),
         password: Joi.string().required(),
      })) : (
         Joi.object({
            companyName: Joi.string().required(),
            role: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
         }))

   return schema.validate(data);
}
