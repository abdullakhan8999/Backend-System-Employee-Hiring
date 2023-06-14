const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().required()
   });
   return schema.validate(data);
};
