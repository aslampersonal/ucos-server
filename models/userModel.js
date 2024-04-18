const mongoose = require("mongoose");

const mongoSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  // fullname: {
  //   type: String,
  //   required: true,
  // },
  // mobile: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      type: String,
      required: false,
    },
  ],
  orders: [
    {
      _id: {
        type: String,
      },
      products: [
        {
          pid: {
            type: String,
          },
          quantity: {
            type: Number,
            default: 0,
          }
        }
      ],
      payment: {
        type: Number,
      },
      orderDate: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("UserData", mongoSchema);