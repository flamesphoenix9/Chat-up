const logger = require("../shared/logger");
const User = require("../user/models/user");
const Chat = require("../chat/models/chat");
const chatService = require("./chat.service");


class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
    this.registerEvents();
    
  }

  registerEvents() {
     console.log(" Registering events for:", this.socket.id, this.socket.user);

    this.socket.on("joinChat", this.handleJoinChat.bind(this));
    this.socket.on("newChat", this.handleNewChat.bind(this));
    this.socket.on("deleteChat", this.handleDeleteChat.bind(this));

    this.socket.on("sendMessage", this.handleSendMessage.bind(this));
    this.socket.on("fetchMessages", this.handleFetchMessages.bind(this));
    this.socket.on("deleteMessage", this.handleDeleteMessage.bind(this));
    this.socket.on(
      "deleteMultipleMessage",
      this.handleDeleteMultipleMessage.bind(this)
    );
  }

  async isUserInChat({ chatId, userId }) {
    const chatCheck = await Chat.findOne({ _id: chatId, members: userId });
    if (!chatCheck) {
        return new Error("use not in chat")
      }
    return !!chatCheck; // true if chat exists and user is a member
  }

  // handler to join chat room
  async handleJoinChat({ chatId }) {
    try {
      await this.isUserInChat({ userId: this.socket.user.id, chatId })
      
      this.socket.join(chatId);
        logger.info(` User ${this.socket.user.id} joined chat ${chatId}`);
        
      // emit to user
      this.socket.emit("joinChatAck", { success: true, chatId });
    } catch (error) {
      this.socket.emit("error", { message: "Failed to join chat" }, error);
      console.error("Join chat error:", error.message);
    }
  }

  //handle to create new chat and join new chat room
  async handleNewChat({ username }) {
    try {
      const chat = await chatService.createChat({
        userId: this.socket.user.id,
        recipientId: await User.getUserId(username),
      });
        
      this.socket.join(chat._id);
      logger.info(` User ${this.socket.user.id} joined chat ${chat._id}`);
        
    // emit to user   
      this.socket.emit("joinChatAck", { success: true, chatId: chat._id });
    } catch (error) {
      this.socket.emit("error", {
        success: false,
        message: "Failed to create chat",
      });
      console.error("Create chat error:", error);
    }
  }

  //handle to delete a chat
  async handleDeleteChat({ chatId }) {
    try {
      await chatService.deleteChat({
        chatId,
        userId: this.socket.user.id,
      });
        
      //Emit to room
      this.io.to(chatId).emit("chatDeleted", { chatId });

      // Acknowledge back to requester
      this.socket.emit("chatDeletedAck", { success: true, chatId });
    } catch (error) {
      this.socket.emit("error", { message: "Failed to delete chat" });
      console.error("Delete chat error:", error.message);
    }
  }

  //handle to send a message
  async handleSendMessage({ chatId, text }) {
    try {
      await this.isUserInChat({ userId: this.socket.user.id, chatId })
      
      //Save message in db
      const message = await chatService.sendMessage({
        chatId,
        senderId: this.socket.user.id,
        text,
      });

    logger.info(` User ${this.socket.user.id} sent message`);
      // Emit message to the room
      this.io.to(chatId).emit("newMessageAck", message);

      // Acknowledge back to requester
      this.socket.emit("newMessageAck", { success: true, chatId, message });
    } catch (err) {
        this.socket.emit("error", {
            success: false,
            message: "Failed to send message",
        });
        console.error("Message send error:", err);
    }
  }

  // handler for fetching messages
  async handleFetchMessages({ chatId }) {
    try {
      await this.isUserInChat({ userId: this.socket.user.id, chatId })

      const messages = await chatService.fetchMessages({
        chatId,
        userId: this.socket.user.id,
      });
      // Emit messages to requester
      this.socket.emit("fetchMessagesAck", { success: true, chatId, messages });
    } catch (err) {
        this.socket.emit("error", {
            success: false,
            message: "Failed to fetch messages",
        });
        console.error("Fetch messages error:", err.message);
    }
  }

  // handler for deleting message
  async handleDeleteMessage({ chatId, messageId }) {
    try {
      await this.isUserInChat({ userId: this.socket.user.id, chatId })

      await chatService.deleteMessage({
        chatId,
        messageId,
        userId: this.socket.user.id,
      });
      //Emit to members
      this.io.to(chatId).emit("messageDeleted", { chatId, messageId });
      // Acknowledge back to requester
      this.socket.emit("messageDeletedAck", {
        success: true,
        chatId,
        messageId,
      });
    } catch (error) {
        this.socket.emit("error", { message: "Failed to delete message" });
        console.error("Delete message error:", error.message);
    }
  }

  //handle to delete multiple messages
  async handleDeleteMultipleMessage({ chatId, messagesId }) {
    try {
      await this.isUserInChat({ userId: this.socket.user.id, chatId })
      
      await chatService.deleteMultipleMessages({
        messages: messagesId,
        userId: this.socket.user.id,
        chatId,
      });

      // Notify everyone in chat
      this.io.to(chatId).emit("messagesDeleted", { chatId, messagesId });

      // Acknowledge back to requester
      this.socket.emit("messagesDeletedAck", {
        success: true,
        chatId,
        messagesId,
      });
    } catch (error) {
        this.socket.emit("error", { success:false, message: "Failed to delete messages" });
        console.error("Delete messages error:", error.message);
    }
  }
}

module.exports = ChatSocket;