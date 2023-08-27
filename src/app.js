const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");


// const { notFound, errorHandler } = require("./middlewares/error.middleware")


// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());
app.use(cors());



const userRoute = require("./Routes/User/User.router")
const groupRoute = require("./Routes/Groups/Group.router")




app.use("/api/users", userRoute);
app.use("/api/grp", groupRoute);



// app.use(notFound);
// app.use(errorHandler);



module.exports = app;