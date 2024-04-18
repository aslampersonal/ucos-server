const express = require("express");

//const app =express()
const jwt = require("jsonwebtoken");
const schema = require("../models/userModel");
const productDatas = require("../models/productModel");
const secretKey = process.env.ADMIN_KEY;

// admin login
const adminLogin = async (req, res) => {
  try {
    
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, ": Admin logged in successfully");

    // check admin email and password
    if (email !== "admin@gmail.com" || password !== "admin123") {
      res.status(401).json({ error: "E-mail or password is invalid" });
      return;
    }

    const token = jwt.sign({ email }, secretKey, { expiresIn: '5h' });
    res.cookie("token", token);
    // res.setHeader("Authorization", token); //  token response to headers

    res.status(201).json({ message: "Welcome, Admin!", cookie: token });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// admin logout
const adminLogout = async (req, res) => {
  
  console.log(req.body.username, "logged out successfully");

  res.json({ message: 'Logged out successfully' });
  
};

// create product
const createProduct = async (req, res) => {
  try {
    await productDatas.insertMany([
      {
        title: req.body.title,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        image: req.file.path,
        category: req.body.category,
        countInStock: req.body.countInStock,
      },
    ])
    .then(() => {
      console.log("Data inserted")  // Success
    }).catch((error) => {
      console.log(error);
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

//image uploading
const uploadImage = async (req, res) => {
  try {
    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
}

// get users details
const getUsers = async (req, res) => {
  try {
    const allUsers = await schema.find({ email: {$ne: "admin@gmail.com"} }, {});
    res.status(200).json({ users: allUsers });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

// get specific user
const getSpecificUser = async (req, res) => {
  try {
    const specificUser = await schema.findById(req.params.id);
    if (!specificUser) {
      res.status(404).json({ message: "User not found", error: error.message });
      return;
    }
    res.status(200).json({ message: "Specific User :", specificUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete an user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await schema.findByIdAndRemove(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// find all product details
const getProducts = async (req, res) => {
  try {
    const allProducts = await productDatas.find();
    res.status(200).json({ message: "All Product List", allProducts });
  } catch (error) {
    res
      .status(404)
      .json({ message: "All Product List Not Found: ", error: error.message });
    console.log(error);
  }
};

const getSpecificProduct = async (req, res) => {
  try {
    const specificProduct = await productDatas.findById(req.params.id);
    if (!specificProduct) {
      res
        .status(404)
        .json({ message: "Specific Product not Found", error: error.message });
      return;
    }
    res
      .status(200)
      .json({ message: "Specific Product details:", specificProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// update product
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, brand, category, price, countInStock} = req.body;

    if (req.file) {
      
      const image = req.file.path;
      const updatedProduct = await productDatas.findOneAndUpdate(
        { _id: id },
        { title, description, brand, category, price, countInStock, image }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated with image", updatedProduct });

    } else {

      const updatedProduct = await productDatas.findOneAndUpdate(
        { _id: id },
        { title, description, brand, category, price, countInStock }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated", updatedProduct });

    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// delete product by id
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  try {
    const deletedProduct = await productDatas.deleteOne({ _id: id });
    console.log(deletedProduct);
    if (deletedProduct) {
      res
        .status(200)
        .json({ message: "Product deleted", product: deletedProduct });
      return;
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// find category wise
const getCategoryWise = async (req, res) => {
  const categoryList = req.params.category;
  // console.log( 'fgfgfg')

  try {
    let categoryProducts;
    // seperate if conditions
    if (categoryList.toLowerCase() === "formal") {
      categoryProducts = await productDatas.find({
        category: { $in: "formal" },
      });
      res.json(categoryProducts);
      return;
    }
    if (categoryList.toLowerCase() === "casual") {
      categoryProducts = await productDatas.find({
        category: { $in: "casual" },
      });
      res.json(categoryProducts);
      return;
    }
    categoryProducts = await productDatas.find({
      category: { $in: categoryList },
    });
    res.json(categoryProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message, message: "Server Error" });
  }
};

// get all orders list
const getAllOrders = async (req, res) => {
  try {
    const orders = await schema.find({ email: {$ne: "admin@gmail.com"} }, { email: 1, orders: 1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Server Error", error: error.message });
  }
};

//update order status
const updateOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const email = req.body.email;
    
    const user = await schema.findOne({ email });

    // Find the order with the specified id in the user's orders array
    const orderToUpdate = user.orders.find(order => order._id === id);

    // If the order with the specified id is found, update its status
    if (orderToUpdate) {
      orderToUpdate.status = status;
      await user.save(); // Save the updated user document to the database
      res.status(200).json({ message: "Order status updated successfully", orderId: orderToUpdate._id });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating orders" });
  }
};

// get revenue
const getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; //using for filtering date
    const users = await schema.find();
    let totalAmount = 0;
    let revenue = 0;

    users.forEach((user) => {
      user.orders.forEach((order) => {
        if (
          order.orderDate >= new Date(startDate) &&
          order.orderDate <= new Date(endDate)
        ) {
          totalAmount += order.payment;
          revenue += order.payment * 0.2;
        }
      });
    });
    res
      .status(200)
      .json({ message: "total orders amount & revenue", totalAmount, revenue });
  } catch (error) {
    res.status(500).json({ error: "server Error", error: error.message });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  createProduct,
  uploadImage,
  getUsers,
  getSpecificUser,
  deleteUser,
  getProducts,
  updateProduct,
  deleteProduct,
  getCategoryWise,
  getSpecificProduct,
  getAllOrders,
  updateOrderStatus,
  getRevenue,
};