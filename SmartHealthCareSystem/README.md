# 🏥 Smart Health Analyzer

AI-powered medical report analysis platform with health tracking and personalized recommendations.

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React + Vite + Tailwind CSS       |
| Backend   | Node.js + Express                 |
| Database  | MongoDB + Mongoose                |
| AI        | OpenAI API (GPT-3.5)              |
| OCR       | Tesseract.js                      |
| Charts    | Recharts                          |
| Maps      | Google Maps Places API             |

## Features

- 🔐 JWT Authentication (Login/Signup)
- 👨‍👩‍👧 Family Member Management
- 📄 Medical Report Upload + OCR + AI Analysis
- 📊 Health Data Visualization (Recharts)
- 🤖 AI Health Chatbot
- 💊 Diet, Exercise & Home Remedy Suggestions
- 🩺 Nearby Doctor Recommendations
- 🌙 Dark Mode UI with Glassmorphism

## Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenAI API Key
- Google Maps API Key (optional)

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-health-analyzer
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | /api/auth/signup      | Register new user          |
| POST   | /api/auth/login       | Login user                 |
| GET    | /api/auth/me          | Get current user           |
| GET    | /api/family           | List family members        |
| POST   | /api/family           | Add family member          |
| PUT    | /api/family/:id       | Update family member       |
| DELETE | /api/family/:id       | Delete family member       |
| POST   | /api/reports/upload   | Upload & analyze report    |
| GET    | /api/reports          | List reports               |
| GET    | /api/reports/:id      | Get single report          |
| DELETE | /api/reports/:id      | Delete report              |
| POST   | /api/chatbot          | Chat with AI assistant     |
| GET    | /api/doctors          | Find nearby doctors        |

## Project Structure

```
SmartHealthCareSystem/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/ (User, FamilyMember, Report)
│   ├── routes/ (auth, familyMembers, reports, chatbot, doctors)
│   ├── server.js
│   ├── .env
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/ (Navbar, Layout, HealthChart, ProtectedRoute)
│   │   ├── pages/ (Login, Signup, Dashboard, UploadReport, FamilyMembers, Chatbot)
│   │   ├── context/AuthContext.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## ⚕️ Disclaimer

This application is for informational purposes only and is **not a substitute** for professional medical advice, diagnosis, or treatment.
