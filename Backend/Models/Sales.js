const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const SaleSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true
  },
  vendor: {
    type: String,
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  quantity: {
    type: Object,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

SaleSchema.plugin(mongoosePaginate);
SaleSchema.plugin(aggregatePaginate);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
//cambio x
