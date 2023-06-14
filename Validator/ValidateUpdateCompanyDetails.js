const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      companyName: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      email: Joi.string().required()
   });
   return schema.validate(data);
};
