const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      engineerStatus: Joi.string().required(),
   });
   return schema.validate(data);
};
