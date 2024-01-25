const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const SaleSchema = new mongoose.Schema({
  client: {
    type: String,
    minlength: 1,
    maxlength: 100,
    required: true,
  },
  vendor: {
    type: String,
    minlength: 1,
    maxlength: 100,
    required: true,
  },
  products: {
    type: Array,
    min: 0,
    required: true,
  },
  total: {
    type: Number,
    min: 0,
    required: true,
  },
  iva: {
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
    default: false,
    required: true
  }
});

SaleSchema.plugin(mongoosePaginate);

const Sales = mongoose.model("Sales", SaleSchema);

module.exports = Sales