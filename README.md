
# JSON Logic Rule Generator – Frontend

This is the React + Vite + Tailwind frontend for the JSON Logic Rule Generator
assignment (Crego, AI Developer).

- Beautiful dark UI with optional light mode
- Rule Builder: prompt + context docs + examples
- Calls FastAPI backend `/generate-rule`
- Shows explanation, used keys, embeddings mapping and RAG snippets
- Raw JSON tab for full payload inspection

## Setup

```bash
npm install
cp .env.example .env
# adjust VITE_API_URL if your backend is not on http://127.0.0.1:8001
npm run dev
```

Then open the URL Vite prints (usually http://127.0.0.1:5173).
