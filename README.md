# JSON Logic Rule Generator — Frontend

This is the official React-based frontend for the JSON Logic Rule Generator system.
It allows users to enter natural-language credit policies and instantly convert them into executable JSON Logic, powered by the backend API (FastAPI + OpenRouter).

The application provides a beautifully designed UI with dark/light mode, summary and raw JSON views, embedding-based key mappings, and RAG-based policy snippet retrieval.

# 🌐 Live Deployment

Frontend:
https://json-logic-frontend.vercel.app/

Backend:
https://json-logic-backend.onrender.com/

# ✨ Features

Natural language → JSON Logic converter

Example prompts for quick testing

Summary view + Raw JSON view

Embedding-based key mapping with similarity scores

Retrieved policy snippets via lightweight RAG

Light/Dark mode with persistent toggle

Clean, modern, responsive UI

Error handling + loading states

Fully deployed on Vercel

Environment variable–based backend URL

# 🛠 Tech Stack

React (Vite)

TailwindCSS

Axios

Lucide Icons

Framer Motion

Vercel

## 📁 Project Structure
~~~

src/
│── App.jsx
│── main.jsx
│── index.css
│── components/
│     └── (your UI components)
│
postcss.config.js
vite.config.js
.env (not committed)
public/
~~~


⚙️ Environment Variables

Create a .env file in the project root:
~~~

VITE_API_URL=https://json-logic-backend.onrender.com
~~~

This tells the frontend which backend server to call.

🚀 Running Locally
1. Clone Repository
~~~
git clone https://github.com/RITIKYADAV0070/JSON-Logic-Frontend
cd JSON-Logic-Frontend
~~~
2. Install Dependencies
~~~
npm install
~~~
3. Create Environment File
~~~
VITE_API_URL=http://localhost:8001
~~~

5. Start Development Server
~~~
npm run dev
~~~

The app will start at:

http://localhost:5173/

📡 API Request Example

The frontend sends the following request to the backend:
~~~

const API_BASE_URL = import.meta.env.VITE_API_URL;

const response = await axios.post(`${API_BASE_URL}/generate-rule`, {
  prompt,
  context_docs
});
~~~

# 🌙 Light & Dark Mode

The UI offers both light and dark themes, with:

Theme toggle button

Automatic persistence using localStorage

Smooth theme transitions

# 📸 Screenshots (optional)

You may add screenshots here when submitting the assignment.

🚀 Deployment on Vercel

Steps already completed:

1. Connect GitHub repo to Vercel

2. Add environment variable in Vercel:
~~~
VITE_API_URL=https://json-logic-backend.onrender.com
~~~

3. Redeploy frontend

4. Backend deployed on Render

5. CORS configured in backend

This ensures full integration end-to-end.

# 🧑‍💻 Author

Ritik Yadav
AI Developer Assignment – Crego
GitHub: https://github.com/RITIKYADAV0070
