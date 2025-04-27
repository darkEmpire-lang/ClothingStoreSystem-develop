const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  profilePic: { type: String }, // <-- Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
