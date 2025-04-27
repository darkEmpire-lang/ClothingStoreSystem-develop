const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v2: cloudinary } = require("cloudinary");

// JWT helper
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, dateOfBirth, mobileNumber, address } = req.body;
    let profilePic = "";

    if (!name || !email || !password || !gender || !dateOfBirth || !mobileNumber || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "user_profiles" });
      profilePic = uploaded.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, password: hashedPassword, gender, dateOfBirth, mobileNumber, address, profilePic
    });

    await newUser.save();
    const token = createToken(newUser._id);

    res.status(201).json({ success: true, message: "Registration successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const token = createToken(user._id);
    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        mobileNumber: user.mobileNumber,
        address: user.address,
        profilePic: user.profilePic,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, password, gender, dateOfBirth, mobileNumber, address } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.address = address || user.address;

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, { folder: "user_profiles" });
      user.profilePic = uploaded.secure_url;
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
// Fetch all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Optionally: check if req.userId is admin
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin deletes any user
const adminDeleteUser = async (req, res) => {
  try {
    // Optionally: check if req.userId is admin
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  verifyToken,
  adminDeleteUser,
  getAllUsers
};
