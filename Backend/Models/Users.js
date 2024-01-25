const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment');

const UserSchema = new mongoose.Schema({
  avatar: {
    type: String,
    minlength: 5,
    maxlength: 600,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 100,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 20,
    required: true,
  },
  address: {
    type: String,
    minlength: 10,
    maxlength: 400,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
  role: {
    type: String,
    minlength: 5,
    maxlength: 100,
    required: true,
  },
  createdAt: {
    type: Date,
    default: moment().format(),
    required: true
  },
  updatedAt: {
    type: Date,
    default: moment().format(),
    required: true
  },
  deleted: {
    type: Boolean,
    default: false,
    required: true
  }
});

UserSchema.pre('save', function (next) {
  this.updateAt = moment().format();
  next();
});

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);

module.exports = User;