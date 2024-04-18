const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const secretKey = process.env.SECRET_KEY;

app.use(cookieParser());

const checkUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; // Extract the token from the header
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }

};

module.exports = checkUserToken;