const routers = {};

routers.adminRouter = require("./adminRouter");
routers.authRouter = require("./authRouter");
routers.jobApplicationRouter = require("./jobApplicationRouter");
routers.jobRouter = require("./jobRouter");
routers.ticketRouter = require("./ticketRouter");
routers.userRouter = require("./userRouter");

module.exports = routers;