const { mongoose } = require("../../shared/db");

const chatSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  group: {
    type: Boolean,
    default: false,
  },
  members: [
    //LIST
    {
      type: String, // UUID
      required: true,
    },
  ],
}, {
  timestamps: true,
  
});

module.exports = mongoose.model("Chat", chatSchema);
