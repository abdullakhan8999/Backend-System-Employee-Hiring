const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      id: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required()
   });
   return schema.validate(data);
};
