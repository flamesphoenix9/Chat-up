const Message = require("../models/messages");

class messageRepo {
  async createMessage(data) {
    return await Message.create(data);
  }

  async fetchChatMessages({ chatId, userId }) {
      return await Message.find({
          chatId,
          deletedBy: { $ne: userId }
      }).sort({
      createdAt: 1,
    });
  }

  async deleteMessageForUser({ messageId,chatId, userId }) {
    return await Message.findByIdAndUpdate(
      chatId,
      messageId,
      { $addToSet: { deletedBy: userId } },
      { new: true }
    );
    }
}

module.exports = new messageRepo();
