const RESPONSES = {
   USER: {
      INVALID_EMAIL: {
         status: "failed",
         message: 'Enter a valid email address.',
      },
      INVALID_PASSWORD: {
         status: "failed",
         message: 'Enter a valid password.',
      },
      CREATE_SUCCESS: {
         status: "success",
         message: "User created successfully.",
      },
      CREATE_FAILED: {
         status: "failed",
         message: "Failed to create user.",
      },
      GET_ALL_SUCCESS: {
         status: "success",
         message: "Retrieved all users successfully.",
      },
      GET_ALL_FAILED: {
         status: "failed",
         message: "Failed to retrieve all users.",
      },
      GET_DETAILS_SUCCESS: {
         status: "success",
         message: "Retrieved user details successfully.",
      },
      GET_DETAILS_FAILED: {
         status: "failed",
         message: "Failed to retrieve user details.",
      },
      UPDATE_SUCCESS: {
         status: "success",
         message: "User updated successfully.",
      },
      UPDATE_FAILED: {
         status: "failed",
         message: "Failed to update user.",
      },
      DELETE_SUCCESS: {
         status: "success",
         message: "User deleted successfully.",
      },
      DELETE_FAILED: {
         status: "failed",
         message: "Failed to delete user.",
      },
      PENDING_STATUS: {
         status: "pending",
         message: "User status is pending.",
      },
      APPROVED_STATUS: {
         status: "approved",
         message: "User status is approved.",
      },
      LOGOUT_SUCCESS: {
         status: "success",
         message: "User logged out successfully.",
      },
      LOGOUT_FAILED: {
         status: "failed",
         message: "Failed to log out user.",
      },
   },
   COMPANY: {
      CREATE_SUCCESS: {
         status: "success",
         message: "Company created successfully.",
      },
      CREATE_FAILED: {
         status: "failed",
         message: "Failed to create company.",
      },
      LOGIN_SUCCESS: {
         status: "success",
         message: "Company logged in successfully.",
      },
      LOGIN_FAILED: {
         status: "failed",
         message: "Failed to log in company.",
      },
      LOGOUT_SUCCESS: {
         status: "success",
         message: "Company logged out successfully.",
      },
      LOGOUT_FAILED: {
         status: "failed",
         message: "Failed to log out company.",
      },
      DELETE_SUCCESS: {
         status: "success",
         message: "Company deleted successfully.",
      },
      DELETE_FAILED: {
         status: "failed",
         message: "Failed to delete company.",
      },
      GET_ALL_SUCCESS: {
         status: "success",
         message: "Retrieved all companies successfully.",
      },
      GET_ALL_FAILED: {
         status: "failed",
         message: "Failed to retrieve all companies.",
      },
      GET_DETAILS_SUCCESS: {
         status: "success",
         message: "Retrieved company details successfully.",
      },
      GET_DETAILS_FAILED: {
         status: "failed",
         message: "Failed to retrieve company details.",
      },
      UPDATE_SUCCESS: {
         status: "success",
         message: "Company updated successfully.",
      },
      UPDATE_FAILED: {
         status: "failed",
         message: "Failed to update company.",
      },
   },
   JOB: {
      CREATE_SUCCESS: {
         status: "success",
         message: "Job created successfully.",
      },
      CREATE_FAILED: {
         status: "failed",
         message: "Failed to create job.",
      },
      GET_ALL_SUCCESS: {
         status: "success",
         message: "Retrieved all jobs successfully.",
      },
      GET_ALL_FAILED: {
         status: "failed",
         message: "Failed to retrieve all jobs.",
      },
      GET_DETAILS_SUCCESS: {
         status: "success",
         message: "Retrieved job details successfully.",
      },
      GET_DETAILS_FAILED: {
         status: "failed",
         message: "Failed to retrieve job details.",
      },
      DELETE_SUCCESS: {
         status: "success",
         message: "Job deleted successfully.",
      },
      DELETE_FAILED: {
         status: "failed",
         message: "Failed to delete job.",
      },
      UPDATE_SUCCESS: {
         status: "success",
         message: "Job updated successfully.",
      },
      UPDATE_FAILED: {
         status: "failed",
         message: "Failed to update job.",
      },
   },
   TICKETS: {
      CREATE_SUCCESS: {
         status: "success",
         message: "Ticket created successfully.",
      },
      CREATE_FAILED: {
         status: "failed",
         message: "Failed to create ticket.",
      },
      GET_ALL_SUCCESS: {
         status: "success",
         message: "Retrieved all tickets successfully.",
      },
      GET_ALL_FAILED: {
         status: "failed",
         message: "Failed to retrieve all tickets.",
      },
      GET_DETAILS_SUCCESS: {
         status: "success",
         message: "Retrieved ticket details successfully.",
      },
      GET_DETAILS_FAILED: {
         status: "failed",
         message: "Failed to retrieve ticket details.",
      },
      UPDATE_SUCCESS: {
         status: "success",
         message: "Ticket updated successfully.",
      },
      UPDATE_FAILED: {
         status: "failed",
         message: "Failed to update ticket.",
      },
      DELETE_SUCCESS: {
         status: "success",
         message: "Ticket deleted successfully.",
      },
      DELETE_FAILED: {
         status: "failed",
         message: "Failed to delete ticket.",
      },
   },
   JOB_APPLICATION: {
      APPLY_SUCCESS: {
         status: "success",
         message: "Job application submitted successfully.",
      },
      APPLY_FAILED: {
         status: "failed",
         message: "Failed to submit job application.",
      },
      UPDATE_SUCCESS: {
         status: "success",
         message: "Job application updated successfully.",
      },
      UPDATE_FAILED: {
         status: "failed",
         message: "Failed to update job application.",
      },
      GET_ALL_SUCCESS: {
         status: "success",
         message: "Retrieved all job applications successfully.",
      },
      GET_ALL_FAILED: {
         status: "failed",
         message: "Failed to retrieve all job applications.",
      },
      GET_DETAILS_SUCCESS: {
         status: "success",
         message: "Retrieved job application details successfully.",
      },
      GET_DETAILS_FAILED: {
         status: "failed",
         message: "Failed to retrieve job application details.",
      },
      DELETE_SUCCESS: {
         status: "success",
         message: "Job application deleted successfully.",
      },
      DELETE_FAILED: {
         status: "failed",
         message: "Failed to delete job application.",
      },
   },
   ERROR: {
      status: "failed",
      message: "An error occurred."
   },
   VALIDATION_FAILED: {
      status: "failed",
      message: "Request body validation failed.",
   },
};
module.exports = RESPONSES;