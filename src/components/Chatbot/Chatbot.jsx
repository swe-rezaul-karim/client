import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState(null); // Store session ID

  useEffect(() => {
    const initialMessage = {
      sender: "bot",
      text: `Hello! I'm here to assist you. You can ask me about our services, troubleshoot issues, or book an appointment with our providers.\n\nHere are some things you can try asking me:\n\n- "I want to book a service." \n- "How do I fix the slow performance?"\n- "What services do you offer?"\n- "Tell me about your service providers."`,

    };
    setMessages([initialMessage]);
  }, []); 

  const sendMessage = async () => {
    if (input.trim() === "") return; // Prevent sending empty messages
    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    try {
      const response = await fetch("http://localhost:5000/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session, // Send session ID
          queryResult: {
            queryText: input,
            languageCode: "en-US",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (typeof data.fulfillmentText !== "string") {
        throw new Error("Response is not a string");
      }
      const botMessage = { sender: "bot", text: data.fulfillmentText };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      if (data.session) {
        setSession(data.session);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, there was an error processing your request.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto relative">
      <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-semibold">Chatbot</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        </div>
        <div className="h-96 overflow-y-auto p-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.sender === "bot" ? "text-left" : "text-right"
              } my-2 p-3 rounded-lg max-w-xs ${
                msg.sender === "bot"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-600 text-white ml-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full border rounded-md p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="1"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage} className="ml-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
            <FaPaperPlane />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;