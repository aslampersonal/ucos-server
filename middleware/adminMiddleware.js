const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const secretKey = process.env.ADMIN_KEY;

app.use(cookieParser());

const checkAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; 
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.decoded = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }

};

module.exports = checkAdminToken;