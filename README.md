# Backend System for Hiring Platform

![GitHub](https://img.shields.io/github/license/abdullakhan8999/Backend-System-Relevel-Employee-Hiring)

## Description

This project is a backend system for a hiring platform. It provides functionalities for managing employees, authentication, and authorization. The system includes models for student, admin, company, job, job application, ticket, and engineer. CRUD operations and authentication operations such as sign up, login, logout, update user details, and update user password are implemented.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/abdullakhan8999/Backend-System-Relevel-Employee-Hiring.git
   ```
2. Navigate to the project directory:
   ```
   cd Backend-System-Relevel-Employee-Hiring
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- bcryptjs
- body-parser
- cookie-parser
- cors
- dotenv
- joi
- jsonwebtoken
- mongoose
- node-rest-client
- validator

## Models

The backend system includes the following models:

- Admin
- Engineer
- Student
- Company
- Job
- JobApplications
- Ticket

## Controllers

The following controllers are implemented in the system:

- **Authentication Controller**:

  - SignUp: Create a new user account.
  - SignIn: Authenticate a user and generate a JSON Web Token (JWT).
  - Logout: Log out a user session.
  - UpdateUserDetails: Update user details such as name, email, or phone number.
  - UpdateUserPassword: Update the user's password.

- **Admin Controller**:

  - getAllStudents: Get all student details.
  - getAllCompanies: Get all company details.
  - getStudentDetails: Get the details of a specific student.
  - getCompanyDetails: Get the details of a specific company.
  - deleteUser: Delete a student or company.

- **Engineer Controller**:

  - getAllEngineers: Get all engineer details.
  - getEngineerDetails: Get the details of a specific engineer.
  - updateEngineerStatus: Update the status of an engineer.
  - deleteEngineer: Delete an engineer.

- **Job Application Controller**:

  - applyForJob: Apply for a job.
  - getAllApplications: Get all job applications.
  - getApplicationId: Get the details of a specific job application.
  - updateApplicationStatus: Update the status of a job application.
  - deleteApplicationById: Delete a job application.

- **Job Controller**:

  - createJob: Create a new job listing.
  - getAllJobs: Get all job listings.
  - getJobDetailsId: Get the details of a specific job.
  - updateJobDetailsId: Update the details of a specific job.
  - deleteJobById: Delete a job listing.

- **Ticket Controller**:

  - createTicket: Create a new ticket.
  - updateTicket: Update a ticket.
  - getAllTickets: Get all tickets.
  - getTicket: Get the details of a specific ticket.

## Validators

The following validators are implemented to validate inputs and requests:

- isEmailExist: Check if an email already exists in the system.
- isPhoneExist: Check if a phone number already exists in the system.
- isUserExist: Check if a user already exists in the system.
- ValidateSignUp: Validate the sign-up request.
- ValidateSignIn: Validate the sign-in request.
- ValidateJob: Validate the job listing request.
- ValidateUpdateStudentDetails: Validate the update student details request.
- ValidateUpdateCompanyDetails: Validate the update company details request.
- ValidateUpdateEngineerDetails: Validate the update engineer details request.
- ValidateUpdateUserPassword: Validate the update user password request.
- ValidateUpdateJobDetails: Validate the update job details request.
- ValidateUpdateApplicationStatus: Validate the update application status request.
- validateTicketStatus: Validate the ticket status.
- isStatusExist: Check if a status already exists in the system.
- IdValidation: Validate the ID format.

## Middleware

The following middleware is implemented:

- isAuthenticatedUser: Check if a user is authenticated.
- authorizedRoles: Check if a user has the authorized role(s) to access specific routes.

## Usage

To use this backend system, follow these steps:

1. Make API requests to the provided endpoints.
2. Authenticate using the provided authentication mechanisms.
3. Access and manage employee data.
4. Implement additional features as needed.

## Configuration

The following environment variables need to be set:

- `PORT`: The port number on which the server will run.
- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `JWT_SECRET`: The secret key used for JSON Web Token (JWT) authentication.

## Testing

To run tests for the backend system, use the following command:

```
npm test
```

## Contributing

Contributions to this project are welcome. To contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

## License

This project is licensed under the [ISC License](LICENSE).

## Issues

If you encounter any issues or bugs, please report them [here](https://github.com/abdullakhan8999/Backend-System-Relevel-Employee-Hiring/issues).

## Contact

For any inquiries or support, please contact the author:

- Name: Patan Abdulla Khan
- Email: abdullakhan8999@gmail.com
- GitHub: [abdullakhan8999](https://github.com/abdullakhan8999)

---
