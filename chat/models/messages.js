const { mongoose } = require("../../shared/db");

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "Chat", 
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedBy: [
    {
      type: String,   // User UUID
      default:[]
    }
  ]
});

module.exports = mongoose.model("Message", messageSchema, "messages");