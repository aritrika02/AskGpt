# AskGPT 🤖

> A full-stack AI chatbot inspired by ChatGPT, built with **React**, **Node.js**, **Express**, **MongoDB** and the **OpenAI API**.

![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-blue)
![AI](https://img.shields.io/badge/AI-OpenAI%20API-success)

## 🔗 Live Demo

**https://ask-gpt-olive.vercel.app**

> Note: the backend runs on a free tier, so the first message may take 30-60 seconds while the server wakes up.

---

## 🚀 About the Project

**AskGPT** is a conversational AI web app. Users chat with an OpenAI model, and every conversation is saved as a thread that can be reopened or deleted later. The React frontend talks to an Express backend, which keeps the OpenAI API key secret on the server and stores chats in MongoDB.

---

## ✨ Key Features

* **AI conversations:** replies from OpenAI's `gpt-4o-mini` model.
* **Conversation memory:** the last 20 messages of a thread are sent with each request, so the bot remembers context.
* **Saved chat history:** threads are stored in MongoDB and listed in a sidebar. Open, create and delete chats.
* **Rich replies:** Markdown rendering with syntax-highlighted code blocks and a typing animation.
* **Secure API key handling:** the key lives in a server-side `.env` file and never reaches the browser.
* **Error handling:** failed requests show a clear message in the UI.

---

## 🔄 How It Works

1. The user types a message in the React chat window.
2. The frontend sends a `POST /api/chat` request with the message and a thread ID.
3. The Express server finds or creates the thread in MongoDB and saves the message.
4. The server sends the recent conversation history to the OpenAI Chat Completions API.
5. The reply is saved to the thread and returned to the frontend, which displays it.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, react-markdown, highlight.js, react-spinners
* **Backend:** Node.js, Express
* **Database:** MongoDB with Mongoose
* **AI:** OpenAI Chat Completions API (`gpt-4o-mini`)
* **Tools:** Git, GitHub, VS Code, npm, dotenv

---

## 📁 Project Structure

```text
AskGPT/
├── Backend/
│   ├── models/Thread.js      # Mongoose schema (thread + messages)
│   ├── routes/chat.js        # API routes
│   ├── utils/openai.js       # OpenAI API call
│   ├── server.js             # Express server and DB connection
│   ├── package.json
│   └── .env.example
├── Frontend/
│   ├── src/                  # React components (App, Sidebar, ChatWindow, Chat)
│   ├── index.html
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## ⚙️ Setup

**Prerequisites:** Node.js, a MongoDB database (local or Atlas), and an OpenAI API key.

1. Clone the repository
   ```bash
   git clone https://github.com/aritrika02/AskGpt.git
   cd AskGpt
   ```
2. Start the backend
   ```bash
   cd Backend
   cp .env.example .env     # then fill in your values
   npm install
   npm run dev
   ```
3. Start the frontend (in a second terminal)
   ```bash
   cd Frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173`

**Environment variables**

| File | Variable | Purpose |
|---|---|---|
| `Backend/.env` | `OPENAI_API_KEY` | Your OpenAI key |
| `Backend/.env` | `MONGODB_URI` | MongoDB connection string |
| `Frontend/.env` | `VITE_API_URL` | Backend URL, e.g. `http://localhost:8080/api` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/thread` | List all threads |
| GET | `/api/thread/:threadId` | Get messages of one thread |
| DELETE | `/api/thread/:threadId` | Delete a thread |
| POST | `/api/chat` | Send a message `{ threadId, message }` and get a reply |

---

## 🔮 Future Improvements

* User authentication so each user sees only their own chats
* Real streaming responses (Server-Sent Events)
* Rate limiting and input validation
* Deployment (Vercel + Render + MongoDB Atlas)