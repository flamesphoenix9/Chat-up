const messageRepo = require("../chat/repos/message.repo");
const chatRepo = require("../chat/repos/chat.repo");

class ChatService {
  
  async sendMessage({ chatId, senderId, text }) {
    return await messageRepo.createMessage({
      chatId,
      senderId,
      text,
    });
  }

  async createChat({ userId, recipientId }) {
    return await chatRepo.createChat({
      userId,
      recipientId,
    });
  }

  async fetchMessages({ chatId, userId }) {
    return await messageRepo.fetchChatMessages({ chatId, userId });
  }

  async deleteChat({ chatId, userId }) {
    return await chatRepo.deleteChat({ chatId, userId });
  }

  async deleteMessage({ messageId, chatId, userId }) {
    return await messageRepo.deleteMessageForUser({ messageId, chatId, userId });
  }

  async deleteMultipleMessages({messages, userId, chatId}) {
    return await Promise.all(
      messages.map((messageId) => this.deleteMessage({ messageId, userId , chatId}))
    );
  }
}

module.exports = new ChatService();
