// Connect to the server
const socket = io();

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Prompt the user for a username
const username = prompt('Enter your username:').trim();
if (username) {
  socket.emit('new user', username);
}

// Function to add a message to the chat
function addMessage(sender, message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', isUser ? 'user' : 'bot');

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('username');
  usernameElement.textContent = sender + ': ';
  messageElement.appendChild(usernameElement);

  const messageText = document.createElement('span');
  messageText.textContent = message;
  messageElement.appendChild(messageText);

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message); // Send to server
    addMessage(username, message, true); // Display user message
    messageInput.value = ''; // Clear input
  }
}

// Prevent duplicate event listeners
socket.off('chat message'); // Remove existing listeners before adding a new one

// Listen for messages from the server
socket.on('chat message', (data) => {
  if (data.username !== username) { // Prevent duplicate display
    addMessage(data.username, data.message, false);
  }
});

// Listen for user join/leave messages
socket.on('user joined', (user) => {
  addMessage('System', `${user} joined the chat.`, false);
});

socket.on('user left', (user) => {
  addMessage('System', `${user} left the chat.`, false);
});

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on pressing Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
