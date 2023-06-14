const Joi = require('joi');

module.exports = (data) => {
   const schema = Joi.object({
      student_id: Joi.string().required(),
      job_id: Joi.string().required(),
   });

   return schema.validate(data);
};
