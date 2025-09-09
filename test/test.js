// Run this in Node.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjQwODI0Zi1mZTY3LTQ3YmItOWY4My00ZDVmMGVmNTE5MDIiLCJ1c2VybmFtZSI6InBob2VuaXgiLCJlbWFpbCI6InBob2VuaXh6aXRoZXJmbGFtZXNAZ21haWwuY29tIiwidmVyaWZpZWQiOnRydWUsImlzU3RhZmYiOmZhbHNlLCJpYXQiOjE3NTc0MTc4OTgsImV4cCI6MTc1NzUwNzg5OH0.E4ujpi09Bshf9i-P2_mgeZxO7WQNTxr-88r6E5EW2HA" },
});
let username = "Phoenix9";
let chatId = "68c04815ac8e3971a1819fda"
let messageId=  '68c04a5f0926dcc535c58c4a'

socket.on("connect", () => {
  console.log(" Connected:", socket.id);

  // // 1 Create new chat
  // socket.emit("newChat", { username});

  // 2 Join existing chat
  socket.emit("joinChat", { chatId});

  // // 3 Send message
  // socket.emit("sendMessage", { chatId, text: "Hello world from one" });

  // // 4 Fetch messages
  // socket.emit("fetchMessages", { chatId});

  // 5  Delete single chat
  // socket.emit("deleteChat", { chatId: "CHAT_ID_HERE" });

  // 6  Delete multiple chats
  // socket.emit("deleteMultipleChat", { chatsId: ["CHAT_ID1", "CHAT_ID2"] });

  // 7 Delete single message
  socket.emit("deleteMessage", {
    chatId,
    messageId
  });

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
