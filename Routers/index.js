const routers = {};
routers.adminRouter = require("./adminRouter");
routers.authRouter = require("./authRouter");
routers.jobApplicationRouter = require("./jobApplicationRouter");
routers.jobRouter = require("./jobRouter");
routers.ticketRouter = require("./ticketRouter");
routers.userRouter = require("./userRouter");
routers.companyRouter = require("./companyRouter");
routers.studentRouter = require("./studentRouter");

module.exports = routers;