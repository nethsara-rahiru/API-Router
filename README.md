# ⚡ API Router — AI Gateway & Key Management Platform

**API Router** is an OpenAI-compatible API gateway and key management platform that unifies multiple AI model providers behind a single API endpoint. It securely encrypts provider keys, balances requests intelligently across key pools, tracks token usage, and provides an interactive Glassmorphism web dashboard.

---

## ✨ Features

- **OpenAI-Compatible Gateway (`/v1/chat/completions`)**: Plug-and-play replacement for OpenAI API calls in any language or SDK.
- **Provider Key Pool & Encryption**: Add upstream provider keys (Groq). Keys are validated against live provider APIs before saving, and stored encrypted with `AES-256-GCM` using SHA-256 derived keys.
- **Developer API Keys**: Issue developer credentials (`apr_live_...`) with bcrypt hashing.
- **Intelligent Load Balancing**: Supports Round Robin, Least Usage, Latency-based, and Smart Routing strategies.
- **Usage & Token Tracking**: Real-time auditing of prompt tokens, completion tokens, HTTP statuses, and latencies.
- **Interactive Glassmorphism Dashboard**: Vanilla HTML5/CSS3/JS Web UI with dark mode, live metrics, key generators, logs table, and interactive documentation tab.

---

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas / Local MongoDB
- **Security**: AES-256-GCM, Bcrypt, JWT (JSON Web Tokens)
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), ES6 JavaScript
- **HTTP Client / Proxy**: Axios

---

## 📁 Repository Structure

```
API Router/
├── Task.txt                 # Project specification and roadmap
├── README.md                # System documentation & guide
└── backend/
    ├── server.js            # Express server entry point
    ├── .env                 # Environment configuration
    ├── config/
    │   └── database.js      # Mongoose database connection
    ├── controllers/         # Request handlers (auth, gateway, key, provider, usage)
    ├── middleware/          # JWT and Developer API Key authentication middleware
    ├── models/              # MongoDB schemas (User, Organization, APIKey, ProviderKey, UsageLog, etc.)
    ├── providers/
    │   └── groq/            # Groq API provider adapter
    ├── public/              # Static Frontend Web Dashboard
    │   ├── index.html       # Single Page Application container
    │   ├── css/             # Glassmorphism & Component styling
    │   └── js/              # Modular UI script components (auth, dashboard, keys, providers, docs, app)
    ├── routes/              # Express API routes
    ├── services/            # Core business logic (Encryption, Gateway, Routing, Provider, Key, Usage)
    └── utils/               # Logger & utility functions
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI.

### 2. Environment Setup
Navigate to the `backend` directory and verify your `.env` file:

```ini
DATABASE_URL=mongodb://localhost:27017/ai-gateway
JWT_SECRET=supersecretjwtkey_change_me_in_production
ENCRYPTION_SECRET=api_router_encryption_secret_key_2026
PORT=3000
```

### 3. Start the Server
```bash
cd backend
node server.js
```
The server will start on `http://localhost:3000` and automatically connect to MongoDB.

---

## 📖 How to Use the System

### Step 1: Open the Web Dashboard
Open your browser and navigate to:
```
http://localhost:3000
```
Create an account or sign in to enter the **API Router** dashboard.

### Step 2: Add an Upstream Provider Key
1. Go to the **Provider Keys** tab.
2. Click **Add Provider Key**.
3. Select **Groq** and enter your Groq API key (`gsk_...`).
4. Click **Validate & Save Key**. The system will test the key against Groq's live API and store it encrypted with AES-256-GCM.

### Step 3: Generate a Developer API Key
1. Go to the **API Keys** tab.
2. Click **Create New Key**.
3. Enter a label (e.g., `Production Web App`).
4. Copy the generated developer key (`apr_live_...`).

### Step 4: Send Chat Completion Requests
Point any OpenAI SDK or HTTP client to `http://localhost:3000/v1` using your developer API key:

#### cURL Example:
```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer apr_live_YOUR_DEVELOPER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain AI API routing."}
    ]
  }'
```

#### Python Example (OpenAI SDK):
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000/v1",
    api_key="apr_live_YOUR_DEVELOPER_KEY"
)

response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": "Hello from Python!"}]
)

print(response.choices[0].message.content)
```

---

## 🔒 Security Architecture

- **Zero Plaintext Storage**: Upstream provider keys are encrypted via `AES-256-GCM` before being written to the database.
- **Key Derivation**: The encryption key is derived using `SHA-256` digest of `ENCRYPTION_SECRET`.
- **Developer Key Hashing**: Developer API keys (`apr_live_...`) are hashed using `bcrypt` (10 rounds).

---

## 📜 License

MIT License. Built for **API Router**.
