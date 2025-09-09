// Run this in Node.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZjg5MDUyZi1mZTY3LTQ3YmItOWY5Mi00ZDVmMGVmNTE5MDIiLCJ1c2VybmFtZSI6InBob2VuaXg5IiwiZW1haWwiOiJwaG9lbml4eml0aGVyQGdtYWlsLmNvbSIsInZlcmlmaWVkIjp0cnVlLCJpc1N0YWZmIjpmYWxzZSwiaWF0IjoxNzU3NDMxNDQ5LCJleHAiOjE3NTc1MjE0NDl9.HBIp5tvGIBBCpben2J1ns28dXkqTKoffmoTLbT6-XW8" },
});
let username = "phoenix";
let chatId ="68c04815ac8e3971a1819fda"

socket.on("connect", () => {
    console.log(" Connected:", socket.id);

    // // 1 Create new chat
    // socket.emit("newChat", { username });

  // 2 Join existing chat
  socket.emit("joinChat", { chatId});

  // 3 Send message
  socket.emit("sendMessage", { chatId, text: "Anas" });

//   // 4 Fetch messages
//   socket.emit("fetchMessages", { chatId});

//   // 5  Delete single chat
//   // socket.emit("deleteChat", { chatId: "CHAT_ID_HERE" });

//   // 6  Delete multiple chats
//   // socket.emit("deleteMultipleChat", { chatsId: ["CHAT_ID1", "CHAT_ID2"] });

//   // 7 Delete single message
//   socket.emit("deleteMessage", {
//     chatId: "CHAT_ID_HERE",
//     messageId: "MESSAGE_ID_HERE",
//   });

// //   // 8  Delete multiple messages
// //   socket.emit("deleteMultipleMessage", {
// //     chatId: "CHAT_ID_HERE",
// //     messagesId: ["MSG_ID1", "MSG_ID2"],
// //   });


});

// Listen for all Ack events
socket.on("joinChatAck", (data) => console.log(" joinChatAck:", data));
socket.on("chatDeletedAck", (data) => console.log(" chatDeletedAck:", data));
socket.on("newMessageAck", (data) => console.log(" newMessageAck:", data));
socket.on("fetchMessagesAck", (data) => console.log(" fetchMessagesAck:", data));
socket.on("messageDeletedAck", (data) => console.log(" messageDeletedAck:", data));
socket.on("messagesDeletedAck", (data) => console.log(" messagesDeletedAck:", data));

// Listen for broadcasted events
socket.on("chatDeleted", (data) => console.log("chatDeleted (broadcast):", data));
socket.on("messageDeleted", (data) => console.log(" messageDeleted (broadcast):", data));
socket.on("messagesDeleted", (data) => console.log(" messagesDeleted (broadcast):", data));
socket.on("newMessageAck", (data) => console.log(" newMessage (broadcast):", data));

// Listen for errors
socket.on("error", (err) => console.error(" Error event:", err));

socket.on("disconnect", () => console.log(" Disconnected"));
