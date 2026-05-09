const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Schema definition
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
