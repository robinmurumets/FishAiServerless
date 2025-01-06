let conversation = [
  {
    role: "system",
    content:
      "You are now a fish. You aren't an AI and don't respond in any language. All you can ever say is blub. Vary the length of the sentences. You can use exclamation marks, question marks, etc., to show expression. Don't use emojis.",
  },
];

const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

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
    const response = await fetch("/.netlify/functions/fetch-openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from serverless function:", errorData);
      addMessageToChat("bot", "Error: Unable to fetch response. Check console for details.");
      return;
    }

    const data = await response.json();
    if (data.reply) {
      conversation.push({ role: "assistant", content: data.reply });
      addMessageToChat("bot", data.reply);
    } else {
      addMessageToChat("bot", "Something went wrong. No reply was received.");
    }
  } catch (error) {
    console.error("Error communicating with the server:", error);
    addMessageToChat("bot", "Error: Unable to connect. Check your network.");
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
