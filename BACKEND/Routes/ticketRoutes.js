const express = require('express');
const { createTicket, getAllTickets, getUserTickets, replyTicket, deleteTicket, updateTicket } = require('../controllers/ticketController');
const authUser = require('../middleware/auth');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/create', authUser, upload.single("image"), createTicket);
router.get('/all', getAllTickets);
router.get('/user', authUser, getUserTickets);
router.post('/reply', replyTicket);
router.delete('/delete/:ticketId', authUser, deleteTicket);
router.put('/update/:ticketId', authUser, upload.single("image"), updateTicket);

module.exports = router;
