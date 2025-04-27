const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productCategory: { type: String, required: true },
  product: { type: String, required: true },
  subject: { type: String, required: true },
  inquiry: { type: String, required: true },
  image: { type: String },
  replies: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
