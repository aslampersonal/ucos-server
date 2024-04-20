const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");

dotenv.config();

mongoose
  .connect("mongodb+srv://ecos:NBnXAf3aCZzPaD2x@cluster0.7ctkgki.mongodb.net/ucos?retryWrites=true&w=majority")
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("database connection failed");
  });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.static("public"));
app.use(cookieParser());

// for admin routes
const adminRoute = require("../routes/adminRoutes");
app.use("/api/admin", adminRoute);

// for user route
const userRoute = require("../routes/userRoutes");
app.use("/api/users", userRoute);

app.listen(3000, () => {
  console.log("server connected at 3000");
});

module.exports = app;