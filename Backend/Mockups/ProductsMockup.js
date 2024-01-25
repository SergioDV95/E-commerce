const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ProductSchema = new mongoose.Schema({
  img: {
    type: String,
    minlength: 50,
    maxlength: 600,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 400,
    required: true,
  },
  category: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  createdAt: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  updateAt: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  deleted: {
    type: Boolean,
    default: false
  }
});


ProductSchema.plugin(mongoosePaginate);

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products