const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      title: Joi.string().min(4).required(),
      description: Joi.string().required(),
      location: Joi.string().min(4).required(),
      requirement: Joi.array().items(Joi.string()).min(1).required(),
      experience: Joi.string().required(),
      department: Joi.string().required(),
      salary: Joi.string().required(),
      hiring_status: Joi.string().required(),
      vacancies: Joi.number().min(1).required(),
   });

   return schema.validate(data);
};
