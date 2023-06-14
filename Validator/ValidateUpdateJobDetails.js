const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      job_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      requirement: Joi.string().required(),
      experience: Joi.string().required(),
      salary: Joi.string().required(),
   });
   return schema.validate(data);
};
