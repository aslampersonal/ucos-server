const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

const user = require("../controller/userController");
const checkUserToken = require("../middleware/userMiddleware");
const googleAuth = require("../middleware/googleAuth");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/products", user.getAllProducts);

app.post("/login", user.userLogin);
// app.get("/googlelogin", googleAuth);
app.post("/logout", user.userLogout);
app.post("/register", user.userRegister);
app.get("/products", checkUserToken, user.getProducts);
app.get("/products/:id", checkUserToken, user.specificProduct);
app.get("/products/category/:category", checkUserToken, user.getCategoryWise);
app.post("/products/cart/:id", checkUserToken, user.addToCart);
app.post("/products/wishlist/:id", checkUserToken, user.addToWishList);
app.get("/cart", checkUserToken, user.cartProducts);
app.delete("/products/cart/:id", checkUserToken, user.RemoveCartProduct);
app.get("/wishlist", checkUserToken, user.wishListProducts);
app.delete("/products/wishlist/:id", checkUserToken, user.RemoveWishlist);
app.post("/products/addorders", checkUserToken, user.oderProduct);
app.get("/orders", checkUserToken, user.getOrderProduct);
app.put("/orders/updateorders/:id", checkUserToken, user.updateOrderStatus);

module.exports = app;