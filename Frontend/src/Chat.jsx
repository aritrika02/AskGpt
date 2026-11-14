import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const SUGGESTIONS = [
    { icon: "fa-lightbulb", text: "Explain recursion with a simple example" },
    { icon: "fa-code", text: "Write a JavaScript function to reverse a string" },
    { icon: "fa-shield-halved", text: "What is the difference between encryption and hashing?" },
    { icon: "fa-briefcase", text: "Give me tips to prepare for a software interview" }
];

function Chat() {
    const { newChat, prevChats, reply, setPrompt } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    // keep the newest message in view
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [prevChats, latestReply]);

    const renderReply = (content, key) => (
        <div className="gptDiv" key={key}>
            <div className="avatar"><i className="fa-solid fa-robot"></i></div>
            <div className="gptContent">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
            </div>
        </div>
    );

    return (
        <div className="chats">
            {newChat && (
                <div className="welcome">
                    <div className="welcomeIcon"><i className="fa-solid fa-bolt"></i></div>
                    <h1>Hello, how can I help?</h1>
                    <p>Ask me anything, or try one of these</p>
                    <div className="suggestions">
                        {SUGGESTIONS.map((s) => (
                            <button key={s.text} className="suggestion" onClick={() => setPrompt(s.text)}>
                                <i className={`fa-solid ${s.icon}`}></i>
                                <span>{s.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {prevChats?.slice(0, -1).map((chat, idx) =>
                chat.role === "user" ? (
                    <div className="userDiv" key={idx}>
                        <p className="userMessage">{chat.content}</p>
                    </div>
                ) : (
                    renderReply(chat.content, idx)
                )
            )}

            {prevChats.length > 0 &&
                (latestReply === null
                    ? renderReply(prevChats[prevChats.length - 1].content, "non-typing")
                    : renderReply(latestReply, "typing"))}

            <div ref={bottomRef}></div>
        </div>
    );
}

export default Chat;