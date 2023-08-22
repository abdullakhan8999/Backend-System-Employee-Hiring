const Joi = require('joi');

module.exports = (data) => {
   let schema;
   if (data.role === 'company') {
      schema = Joi.object({
         name: Joi.string().required(),
         role: Joi.string().required(),
         description: Joi.string().required(),
         location: Joi.string().required(),
         email: Joi.string().required(),
         password: Joi.string().required(),
         companySize: Joi.number().required(),
         companyCategories: Joi.array().items(Joi.string()).required(),
         companyDepartments: Joi.array().items(Joi.string()).required(),
      })
   } else {
      schema = Joi.object({
         name: Joi.string().required(),
         email: Joi.string().required(),
         role: Joi.string().required(),
         password: Joi.string().required(),
      })
   }

   return schema.validate(data);
}
