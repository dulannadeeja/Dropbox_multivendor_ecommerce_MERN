const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  discountPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: {
    type: [
      {
        url: {
          type: String,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ]
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      }
    },
  ],
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    default: 0,
  },
});


module.exports = mongoose.model("Product", productSchema);
