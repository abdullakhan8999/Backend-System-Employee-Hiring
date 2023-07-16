const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
   });
   return schema.validate(data);
};
