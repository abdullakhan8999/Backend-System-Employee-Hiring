class ApiFeatures {
   constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
   }

   searchByTitle() {
      if (this.queryStr.title) {
         const title = {
            title: {
               $regex: this.queryStr.title,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...title });
      }
      return this;
   }
   searchByCompany() {
      if (this.queryStr.company_name) {
         const company_name = {
            company_name: {
               $regex: this.queryStr.company_name,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...company_name });
      }
      return this;
   }
   searchByLocation() {
      console.log(this.queryStr.location);
      if (this.queryStr.location) {
         const location = {
            location: {
               $regex: this.queryStr.location,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...location });
      }
      return this;
   }
   filterByExperience() {
      if (this.queryStr.experience) {
         const experience = {
            experience: {
               $regex: this.queryStr.experience,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...experience });
      }
      return this;
   }
   filterBySalary() {
      if (this.queryStr.salary) {
         const salary = {
            salary: {
               $regex: this.queryStr.salary,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...salary });
      }
      return this;
   }
}
module.exports = ApiFeatures;
