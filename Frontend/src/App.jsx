
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { api } from "./api.js";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Restore an existing login after refreshing
  useEffect(() => {
    async function checkLogin() {
      const token = sessionStorage.getItem("askgpt_token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const data = await api("/auth/me");
        setUser(data.user);
      } catch {
        sessionStorage.removeItem("askgpt_token");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkLogin();
  }, []);

  function logout() {
    sessionStorage.removeItem("askgpt_token");

    setUser(null);
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setAllThreads([]);
    setCurrThreadId(uuidv4());
    setNewChat(true);
  }

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    user, logout
  };

  if (checkingAuth) {
    return <div className="app">Checking session...</div>;
  }

  return (
    <div className="app">
      {user ? (
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
        </MyContext.Provider>
      ) : (
        <Auth onAuth={setUser} />
      )}
    </div>
  );
}

export default App;
