const Chat = require("../models/chat");

class chatRepo {
  async createChat({ userId, recipientId }) {
    const chat = await Chat.create({ members: [userId, recipientId] });
    return chat._id;
  }

  async deleteChat({ chatId, userId }) {
    return await Chat.findOneAndDelete({
      _id: chatId,
      group: false, // Delete only P2P chats
      members: userId,
    });
  }
}

module.exports = new chatRepo();