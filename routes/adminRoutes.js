const express = require("express")
const bodyparser = require("body-parser");
const app = express();
const multer = require('multer');
const path = require('path');

const admin = require("../controller/adminController");
const checkAdminToken = require("../middleware/adminMiddleware");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
        filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post("/login", admin.adminLogin);
app.post("/logout", admin.adminLogout);
app.post("/productupload", upload.single('image'), checkAdminToken, admin.createProduct);
app.get("/users", checkAdminToken, admin.getUsers);
app.get("/users/:id", checkAdminToken, admin.getSpecificUser);
app.delete("/users/:id", checkAdminToken, admin.deleteUser);
app.get("/products", checkAdminToken, admin.getProducts);
app.put("/products/:id", checkAdminToken, admin.updateProduct);
app.put("/products/image/:id", upload.single('image'), checkAdminToken, admin.updateProduct);
app.delete("/products/:id", checkAdminToken, admin.deleteProduct);
app.get("/products/category/:category", checkAdminToken, admin.getCategoryWise);
app.get("/products/:id", checkAdminToken, admin.getSpecificProduct);
app.get("/orders", checkAdminToken, admin.getAllOrders);
app.put("/orders/updateorders/:id", checkAdminToken, admin.updateOrderStatus);
app.get("/revenue", checkAdminToken, admin.getRevenue);

module.exports = app;

