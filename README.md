# AskGPT

\# AskGPT 🤖



> A responsive, full-stack AI chatbot application inspired by ChatGPT, built from scratch using \*\*Node.js\*\*, \*\*Express.js\*\*, and the \*\*OpenAI API\*\*.



!\[Project Status](https://img.shields.io/badge/status-completed-success)

!\[Tech Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Express%20%7C%20OpenAI-blue)

!\[License](https://img.shields.io/badge/license-MIT-green)



\---



\## 🚀 About the Project



\*\*AskGPT\*\* is a feature-rich conversational AI web application designed to replicate core functionalities of modern AI chat interfaces. It bridges the gap between a clean, intuitive frontend interface and powerful generative AI models via a secure backend proxy server. 



The project emphasizes secure API management, clean asynchronous request handling, and a seamless user experience, making it an ideal showcase for full-stack integration skills.



\---



\## ✨ Key Features



\* \*\*Real-Time AI Conversations:\*\* Powered by OpenAI's advanced language models to generate contextual, dynamic text responses.

\* \*\*Secure Backend Architecture:\*\* Utilizes an Express.js server to handle API calls, keeping sensitive OpenAI API keys hidden safely on the server side.

\* \*\*Responsive UI/UX:\*\* Clean layout designed with modern CSS and JavaScript for optimal desktop and mobile usability.

\* \*\*Error Handling \& Resilience:\*\* Robust handling for API rate limits, network timeouts, and invalid prompts.



\---



\## 🔄 System Workflow \& Architecture



The application follows a client-server architecture where user inputs are securely routed through a custom backend before reaching the AI model:



1\. \*\*User Interaction:\*\* The user types a prompt into the frontend chat interface (`index.html` / `style.css` / `script.js`).

2\. \*\*Client Request:\*\* The frontend sends an asynchronous HTTP `POST` request containing the prompt to the local Express.js backend server.

3\. \*\*Backend Middleware \& Processing:\*\* The Node.js/Express server receives the request, validates it, and attaches the secure API authorization headers.

4\. \*\*OpenAI API Integration:\*\* The backend securely communicates with the OpenAI API endpoint using the official client library.

5\. \*\*Response Delivery:\*\* The AI-generated response is sent back to the Express server, which then formats and returns it to the frontend to render dynamically on the screen.



\---



\## 🛠️ Tech Stack



\* \*\*Frontend:\*\* HTML5, CSS3, JavaScript (ES6+)

\* \*\*Backend:\*\* Node.js, Express.js

\* \*\*AI/ML Integration:\*\* OpenAI API (`openai` package)

\* \*\*Environment Management:\*\* `dotenv`

\* \*\*Development Tools:\*\* Git, Visual Studio Code, npm



\---



\## 📁 Project Structure



```text

AskGPT/

│

├── public/                # Frontend static assets

│   ├── index.html         # Main user interface

│   ├── style.css          # Styling and responsive layouts

│   └── script.js          # DOM manipulation and client-side logic

│

├── .env                   # Environment variables (API keys - ignored by git)

├── .gitignore             # Specifies intentionally untracked files

├── package.json           # Project dependencies and metadata

└── server.js              # Express backend server and OpenAI routing

