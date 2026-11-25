
import "./Sidebar.css";

import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { api } from "./api.js";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setPrevChats
  } = useContext(MyContext);

  // Load only the logged-in user's conversations
  const getAllThreads = async () => {
    try {
      const res = await api("/thread");

      if (!Array.isArray(res)) {
        throw new Error("Invalid chat history response");
      }

      setAllThreads(
        res.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title
        }))
      );

    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Refresh history when the current thread changes
  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // Start a new conversation
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setCurrThreadId(uuidv4());
  };

  // Open a previous conversation
  const changeThread = async (threadId) => {
    try {
      const messages = await api(`/thread/${threadId}`);

      setCurrThreadId(threadId);
      setPrevChats(messages);
      setNewChat(false);
      setReply(null);
      setPrompt("");

    } catch (err) {
      console.error("Failed to open conversation:", err);
    }
  };

  // Delete a conversation
  const deleteThread = async (threadId) => {
    try {
      await api(`/thread/${threadId}`, {
        method: "DELETE"
      });

      setAllThreads((prev) =>
        prev.filter((thread) =>
          thread.threadId !== threadId
        )
      );

      if (threadId === currThreadId) {
        createNewChat();
      }

    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  return (
    <section className="sidebar">

      {/* New chat button */}
      <button
        className="newChatBtn"
        onClick={createNewChat}
      >
        <i className="fa-solid fa-bolt"></i>
        <span>New chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      {/* Saved conversation list */}
      <ul className="history">
        {allThreads.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() =>
              changeThread(thread.threadId)
            }
            className={
              thread.threadId === currThreadId
                ? "highlighted"
                : ""
            }
          >
            <span>{thread.title}</span>

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sign">
        <p>AskGPT · Private workspace</p>
      </div>

    </section>
  );
}

export default Sidebar;
