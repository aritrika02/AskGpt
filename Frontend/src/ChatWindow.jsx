
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { api } from "./api.js";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    user,
    logout
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Send message to Groq through the secured backend
  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    const message = prompt.trim();

    setLoading(true);
    setError("");
    setNewChat(false);

    try {
      const res = await api("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: message,
          threadId: currThreadId
        })
      });

      // Save both messages in React state
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: message
        },
        {
          role: "assistant",
          content: res.reply
        }
      ]);

      setReply(null);
      setPrompt("");

    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  // Clear errors when switching chats
  useEffect(() => {
    setError("");
  }, [currThreadId]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="chatWindow">

      {/* Navbar */}
      <div className="navbar">
        <span className="brand">
          <i className="fa-solid fa-bolt"></i>
          <span className="brandText">AskGPT</span>
        </span>

        <div
          className="userIconDiv"
          onClick={handleProfileClick}
        >
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* Profile dropdown */}
      {isOpen && (
        <div className="dropDown">

          <div className="dropDownItem">
            <i className="fa-solid fa-user"></i>
            {" "}
            {user?.name || "User"}
          </div>

          <button
            type="button"
            className="dropDownItem"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            {" "}Log out
          </button>

        </div>
      )}

      {/* Chat messages */}
      <Chat />

      {/* Loading indicator */}
      <ScaleLoader
        color="#a78bfa"
        loading={loading}
      />

      {/* Error message */}
      {error && (
        <p className="errorMsg">
          {error}
        </p>
      )}

      {/* Chat input */}
      <div className="chatInput">
        <div className="inputBox">

          <input
            placeholder="Ask anything"
            value={prompt}
            disabled={loading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getReply();
              }
            }}
          />

          <button
            id="submit"
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={getReply}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>

        </div>

        <p className="info">
          AskGPT can make mistakes. Check important info.
        </p>
      </div>

    </div>
  );
}

export default ChatWindow;
