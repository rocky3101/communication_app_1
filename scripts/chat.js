document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chatWindow');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const loggedInUserName = document.getElementById('loggedInUser');
  
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      window.location.href = './Welcome.html';
    }
    loggedInUserName.innerText = loggedInUser.name;

    const displayMessage = (message) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message');
      messageElement.innerHTML = `<div class="message-time">${message.time}</div><div><strong>${message.user}:</strong></div><div class="message-text">${message.text}</div>`;
      chatWindow.appendChild(messageElement);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    let chatMessages = localStorage.getItem('chatMessages') ? JSON.parse(localStorage.getItem('chatMessages')) : [];
    chatMessages.forEach(message => {
      displayMessage(message);
    });
  
    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const messageText = chatInput.value.trim();
  
      if (messageText === '') {
        return;
      }
  
      const messageTime = new Date().toLocaleString();
      const message = {
        user: loggedInUser.name,
        text: messageText,
        time: messageTime,
      };
  
      chatMessages.push(message);
      localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  
      displayMessage(message);
  
      chatInput.value = '';
    });
  
    
  });
  