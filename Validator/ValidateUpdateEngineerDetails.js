const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      engineer_id: Joi.string().required(),
      engineerStatus: Joi.string().required(),
   });
   return schema.validate(data);
};
