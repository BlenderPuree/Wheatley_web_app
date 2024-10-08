document.getElementById('send-btn').addEventListener('click', sendMessage);

let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

function updateChatWindow(message, sender) {
  const chatWindow = document.getElementById('chat-window');
  const newMessage = document.createElement('div');
  newMessage.className = 'message ' + sender;
  newMessage.innerText = message;
  chatWindow.appendChild(newMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to bottom
}

function displayChatHistory() {
  chatHistory.forEach(entry => {
    updateChatWindow(entry.message, entry.sender);
  });
}

async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  // Display the user's message
  updateChatWindow(userInput, 'user');
  chatHistory.push({ sender: 'user', message: userInput });
  document.getElementById('user-input').value = '';

  // Send request to the AI backend (using a free API like Ollama or GPT-J)
  const response = await getAIResponse(userInput);

  // Display the bot's message
  updateChatWindow(response, 'bot');
  chatHistory.push({ sender: 'bot', message: response });

  // Save chat history in localStorage
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

async function getAIResponse(input) {
  // Replace this with your own API call to Ollama or GPT-J
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: input
    })
  });

  const data = await response.json();
  return data.output || "Sorry, I didn't understand that.";
}

// Load past chats when the page loads
displayChatHistory();
