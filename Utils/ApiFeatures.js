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

   searchByName() {
      if (this.queryStr.name) {
         const name = {
            name: {
               $regex: this.queryStr.name,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...name });
      }
      return this;
   }

   searchByCompany_name() {
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

   searchByUserStatus() {
      if (this.queryStr.userStatus) {
         const userStatus = {
            userStatus: {
               $regex: this.queryStr.userStatus,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...userStatus });
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

   searchByRole() {
      if (this.queryStr.role) {
         const role = {
            role: {
               $regex: this.queryStr.role,
               $options: "i",
            },
         }
         this.query = this.query.find({ ...role });
      }
      return this;
   }
}
module.exports = ApiFeatures;
