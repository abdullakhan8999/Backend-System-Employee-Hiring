const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      job_id: Joi.string().required(),
   });
   return schema.validate(data);
};
