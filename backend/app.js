require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { userVerifyToken, adminVerifyToken } = require('./middleware/verify.js');
const loingRouter = require('./routes/login.route');
const userRouter = require('./routes/user.route');
const adminRouter = require('./routes/admin.route');

const app = express();

var corsOptions = { origin: "*" };

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.use('/api/login', loingRouter);
// routes for admin
app.use('/api/admin', adminVerifyToken, adminRouter);
// routes for user
app.use('/api/user', userVerifyToken, userRouter)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});