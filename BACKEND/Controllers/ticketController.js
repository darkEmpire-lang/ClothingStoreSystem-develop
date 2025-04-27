const Ticket = require("../models/Ticket.js");
const cloudinary = require('cloudinary').v2;


// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { productCategory, product, subject, inquiry } = req.body;
    const userId = req.userId;

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tickets",
      });
      imageUrl = uploadResult.secure_url;
    }

    const ticket = new Ticket({
      userId,
      productCategory,
      product,
      subject,
      inquiry,
      image: imageUrl,
    });

    await ticket.save();
    res.status(201).json({ success: true, message: "Ticket Raised Successfully", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all tickets (admin)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("userId", "name email profilePic");
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tickets for a specific user
const getUserTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const tickets = await Ticket.find({ userId });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin reply to a ticket
const replyTicket = async (req, res) => {
  try {
    const { ticketId, reply } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    ticket.replies.push({ message: reply });
    await ticket.save();

    res.status(200).json({ success: true, message: "Reply Sent", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Ticket
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    res.status(200).json({ success: true, message: "Ticket Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Ticket (only inquiry, subject, product, productCategory, and image)
const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { inquiry, subject, product, productCategory } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket Not Found" });

    // Restrict edits if last edit was within 24 hours
    const lastEditTime = new Date(ticket.updatedAt);
    const now = new Date();
    const diffHours = (now - lastEditTime) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res.status(400).json({ success: false, message: "You can only edit a ticket once every 24 hours." });
    }

    if (inquiry) ticket.inquiry = inquiry;
    if (subject) ticket.subject = subject;
    if (product) ticket.product = product;
    if (productCategory) ticket.productCategory = productCategory;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "tickets",
      });
      ticket.image = uploadResult.secure_url;
    }

    ticket.updatedAt = now;
    await ticket.save();

    res.status(200).json({ success: true, message: "Ticket Updated Successfully", ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  replyTicket,
  deleteTicket,
  updateTicket,
};
