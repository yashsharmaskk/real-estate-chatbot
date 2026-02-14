# 🏡 AI Real Estate Chatbot

A full-stack AI-powered real estate search platform that uses natural language processing to help users find their dream home through conversational search.

**Live Demo**: [View Application](#) | **GitHub**: [Repository](https://github.com/yashsharmaskk/real-estate-chatbot)

> ⚠️ **Important**: The backend is hosted on Render's free tier. If the app seems unresponsive on first load, please **try 1-2 times** to wake up the server (it goes inactive after 15 minutes of inactivity). If it goes into "thinking" mode indefinitely, just **refresh the page and try again**.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Approach](#-project-approach)
- [Challenges & Solutions](#-challenges--solutions)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-endpoints)
- [Deployment](#-deployment)

---

## 🎯 Features

### Core Functionality
- **Natural Language Search**: Type queries like "3 bedroom under $500,000 in New York"
- **AI-Powered Intent Extraction**: Uses Groq API with Llama 3.1 8B to understand user requirements
- **Smart Property Filtering**: Backend filters properties based on location, bedrooms, price, and amenities
- **Property Comparison**: Select up to 3 properties to compare side-by-side
- **Saved Properties**: Bookmark favorite properties to MongoDB Atlas
- **Real-Time Search**: Filter displayed properties instantly by typing

### UI/UX
- **Modern Chat Interface**: Beautiful split-screen UI with chat on the left and property results on the right
- **Glassmorphism Design**: Frosted glass effects with vibrant gradients
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Fade-in, slide-in, and hover effects

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: RESTful API server
- **MongoDB Atlas**: Cloud database for saved properties
- **Groq API**: NLP intent extraction with Llama 3.1 8B (faster & cheaper than OpenAI)
- **Mongoose**: MongoDB ODM

### Frontend
- **React.js**: UI framework
- **Axios**: HTTP client
- **CSS3**: Modern styling with gradients and glassmorphism

### Deployment
- **Backend**: Render (free tier with cold starts)
- **Frontend**: Vercel/Netlify
- **Database**: MongoDB Atlas (cloud)

---

## 🧠 Project Approach

### 1. **Architecture Design**
The application follows a **client-server architecture** with clear separation of concerns:

- **Frontend (React)**: Handles UI rendering, user interactions, and state management
- **Backend (Express)**: Manages API routes, NLP processing, data merging, and business logic
- **Database (MongoDB)**: Stores user-saved properties with session management

### 2. **Data Management Strategy**
Instead of a traditional database for property listings, the project uses **three separate JSON files** that are merged at runtime:

- `property_basics.json`: Core info (title, price, location)
- `property_characteristics.json`: Details (bedrooms, bathrooms, amenities)
- `property_images.json`: Image URLs

**Why this approach?**
- Simulates a microservices architecture where data comes from different sources
- Demonstrates data merging/aggregation skills
- Easier to update individual aspects without touching the entire dataset

### 3. **NLP Integration**
Initially used **Google Gemini**, but migrated to **Groq (Llama 8B)** for:
- **Speed**: 10x faster inference
- **Cost**: Generous free tier
- **Reliability**: Better uptime and rate limits

The NLP service extracts structured filters from natural language:
```
Input: "3 bedroom apartment in Miami under $500k with parking"
Output: {
  location: "Miami",
  bedrooms: 3,
  maxPrice: 500000,
  amenities: ["parking"]
}
```

### 4. **State Management**
- **Session-based**: Uses `sessionId` to track user preferences
- **Real-time Updates**: Saved properties sync immediately across UI
- **Type Safety**: Backend converts property IDs to strings to match MongoDB's storage format

---

## 🚧 Challenges & Solutions

### Challenge 1: **Data Type Mismatch (Saved Properties Bug)**
**Problem**: Saved properties weren't displaying even though they were stored in MongoDB.

**Root Cause**: 
- Property IDs in JSON files were **Numbers** (e.g., `1`)
- MongoDB stored them as **Strings** (e.g., `"1"`)
- JavaScript's `===` comparison failed: `"1" !== 1`

**Solution**:
```javascript
// Before (broken)
savedIds.includes(prop.id)

// After (fixed)
savedIds.includes(String(prop.id))
```

### Challenge 2: **NLP Provider Migration**
**Problem**: Google Gemini API had rate limits and slower response times during testing.

**Solution**: 
- Migrated to **Groq API** with Llama 3.1 8B
- Created modular service architecture (`groqService.js`) for easy swapping
- Updated environment variables and dependencies

### Challenge 3: **Real-Time State Synchronization**
**Problem**: Saved properties weren't updating in the UI immediately after saving/unsaving, requiring manual page refresh.

**Root Cause**: 
- Frontend state (`savedPropertyIds`) wasn't syncing with backend after save/unsave operations
- The "Saved Properties" modal showed stale data

**Solution**:
- Added `useEffect` hook to fetch saved property IDs on component mount
- Updated `handleSaveProperty` to refresh the saved view if it's currently open
- Implemented real-time state updates:
  ```javascript
  // Refresh saved view if open
  if (showSavedView) {
      const response = await axios.get(`${API_BASE_URL}/saved`);
      setSavedProperties(response.data.properties || []);
  }
  ```

### Challenge 4: **Data Merging Complexity**
**Problem**: Property data was split across three JSON files, requiring complex merging logic to create complete property objects.

**Root Cause**: 
- Each file had different structures and property counts
- Some properties existed in one file but not others
- Needed to handle missing data gracefully

**Solution**:
- Created `dataLoader.js` service with intelligent merging:
  ```javascript
  const mergedProperties = basics.map(basic => ({
      ...basic,
      ...(characteristics.find(c => c.id === basic.id) || {}),
      images: (images.find(i => i.id === basic.id)?.images || [])
  }));
  ```
- Added fallback values for missing fields
- Implemented caching to avoid re-reading files on every request

### Challenge 5: **MongoDB Connection in Production**
**Problem**: Local MongoDB connection string didn't work on Render.

**Solution**:
- Migrated to **MongoDB Atlas** (cloud database)
- Updated connection string to use `mongodb+srv://` protocol
- Stored credentials in environment variables

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Groq API Key** ([Get one here](https://console.groq.com/))

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   copy .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the backend server**:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

---

## 📡 API Endpoints

### Chat Endpoint
```
POST /api/chat
```
**Request Body**:
```json
{
  "message": "3 bedroom under $500,000 in New York with parking"
}
```

**Response**:
```json
{
  "reply": "I found 2 properties that match what you're looking for!",
  "properties": [...],
  "filters": {
    "location": "New York",
    "bedrooms": 3,
    "maxPrice": 500000,
    "amenities": ["parking"]
  }
}
```

### Save Property
```
POST /api/save-property
```
**Request Body**:
```json
{
  "propertyId": "1",
  "sessionId": "default-session"
}
```

### Get Saved Properties
```
GET /api/saved?sessionId=default-session
```

### Remove Saved Property
```
DELETE /api/save-property/:propertyId
```

---

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `NODE_ENV=production`

**Note**: Free tier servers sleep after 15 minutes of inactivity. First request may take 30-60 seconds.

### Frontend (Vercel/Netlify)

1. Update API base URL in `frontend/src/App.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy the `build` folder to Vercel or Netlify

---

## 📝 Sample Queries

Try these example queries:

- "Show me 3 bedroom apartments under $500,000"
- "2 bedroom condo in Miami with beach access"
- "Luxury properties with private garden"
- "Affordable 1 bedroom in New York"
- "4 bedroom house in Seattle under $1 million"
- "Penthouse with rooftop terrace"
- "New york"

---

## 🐛 Troubleshooting

**Server Not Responding (Render)**:
- The free-tier server sleeps after 15 minutes
- Try refreshing 1-2 times to wake it up
- Wait 30-60 seconds for cold start

**MongoDB Connection Error**:
- Verify MongoDB Atlas connection string
- Check if IP address is whitelisted (use `0.0.0.0/0` for all IPs)
- Ensure username/password are correct

**Groq API Error**:
- Verify API key is correct in `.env`
- Check API quota at https://console.groq.com/

**CORS Error**:
- Backend has CORS enabled for all origins in development
- For production, update CORS settings in `server.js`

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using React, Node.js, MongoDB Atlas, and Groq AI (Llama 3.1 8B)
