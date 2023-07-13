class ApiFeatures {
   constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
   }

   searchByFirstName() {
      if (this.queryStr.firstName) {
         const firstName = {
            firstName: {
               $regex: this.queryStr.firstName,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...firstName });
      }
      return this;
   }

   searchByEmail() {
      if (this.queryStr.email) {
         const email = {
            email: {
               $regex: this.queryStr.email,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...email });
      }
      return this;
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

   searchByCompanyName() {
      if (this.queryStr.companyName) {
         const companyName = {
            companyName: {
               $regex: this.queryStr.companyName,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...companyName });
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

   searchByApplicationStatus() {
      if (this.queryStr.applicationStatus) {
         const applicationStatus = {
            applicationStatus: {
               $regex: this.queryStr.applicationStatus,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...applicationStatus });
      }
      return this;
   }

   searchByStudentId() {
      if (this.queryStr.student_id) {
         const student_id = {
            student_id: this.queryStr.student_id,
         }
         this.query = this.query.find({ ...student_id });
      }
      return this;
   }

   searchByEngineerStatus() {
      if (this.queryStr.engineerStatus) {
         const engineerStatus = {
            engineerStatus: {
               $regex: this.queryStr.engineerStatus,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...engineerStatus });
      }
      return this;
   }
}
module.exports = ApiFeatures;
