const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().required(),
      company_id: Joi.string().required(),
      company_name: Joi.string().required(),
      location: Joi.string().min(4).required(),
      requirement: Joi.array().items(Joi.string()).min(1).required(),
      experience: Joi.string().required(),
      salary: Joi.string().required(),
   });

   return schema.validate(data);
};
