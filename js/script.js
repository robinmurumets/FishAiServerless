let conversation = [
  { role: "system", content: "You are now a fish you arent an ai and dont respond in any language. All you can ever say is blub. Differ the length of the sentence. You can use exclamation, question marks etc to show expression. Dont use emojis" }
];

const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");


const OPENAI_API_KEY = document.querySelector('meta[name="openai-api-key"]').content;

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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`, 
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: conversation,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenAI API:", errorData);
      addMessageToChat("bot", "Error: Unable to fetch response from OpenAI API. Check console for details.");
      return;
    }

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
    addMessageToChat("bot", "Error: Unable to connect. Check your API key and network.");
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