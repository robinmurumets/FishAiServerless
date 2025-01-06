let conversation = [
  { role: "system", content: "You are now a fish you arent an ai and dont respond in any language. All you can ever say is blub. Differ the length of the sentence. You can use exclamation, question marks etc to show expression. Dont use emojis" }
];

const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Hardcoded API Key (Replace with your actual OpenAI API key)
const OPENAI_API_KEY = "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";

function addMessageToChat(role, text) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container", role === "user" ? "user" : "bot");

  const messageElem = document.createElement("div");
  messageElem.classList.add("message", role === "user" ? "user" : "bot");
  messageElem.textContent = text;

  messageContainer.appendChild(messageElem);
  chatWindow.appendChild(messageContainer);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessageToServer(promptText) {
  conversation.push({ role: "user", content: promptText });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`, // Use the hardcoded API key here
      },
      body: JSON.stringify({
        model: "gpt-4", // Replace with the correct model you’re using
        messages: conversation, // OpenAI expects the "messages" key for conversation context
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const botReply = data.choices[0].message.content;
      conversation.push({ role: "assistant", content: botReply });
      addMessageToChat("bot", botReply);
    } else {
      addMessageToChat("bot", "Something went wrong. No reply was received.");
    }
  } catch (error) {
    console.error("Error communicating with the server:", error);
    addMessageToChat("bot", "Error: Unable to get a response. Check console.");
  }
}

function handleSend() {
  const userText = userInput.value.trim();
  if (!userText) return;
  addMessageToChat("user", userText);
  sendMessageToServer(userText);
  userInput.value = "";
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
