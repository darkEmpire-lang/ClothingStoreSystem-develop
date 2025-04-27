const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  verifyToken,
  getAllUsers,
  adminDeleteUser
} = require('../controllers/userController');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single("profilePic"), registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.put('/update/:id', verifyToken, upload.single("profilePic"), updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/all', getAllUsers); // List all users
router.delete('/admin-delete/:id', adminDeleteUser); // 

module.exports = router;
