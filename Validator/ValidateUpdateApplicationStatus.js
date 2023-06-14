const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      application_id: Joi.string().required(),
      application_status: Joi.string().required()
   });
   return schema.validate(data);
};
