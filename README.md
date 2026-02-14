# 🏡 AI Real Estate Chatbot

A full-stack AI-powered real estate search platform that uses natural language processing to help users find their dream home through conversational search.

## 🎯 Features

- **Natural Language Search**: Type queries like "3 bedroom under $500,000 in New York"
- **AI-Powered Intent Extraction**: Uses Groq API with Llama 8B to understand user requirements
- **Smart Property Filtering**: Backend filters properties based on location, bedrooms, price, and amenities
- **Modern Chat Interface**: Beautiful split-screen UI with chat on the left and property results on the right
- **Save Properties**: Bookmark favorite properties to MongoDB
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: RESTful API server
- **MongoDB**: Database for saved properties
- **Groq API**: NLP intent extraction with Llama 3.1 8B
- **Mongoose**: MongoDB ODM

### Frontend
- **React.js**: UI framework
- **Axios**: HTTP client
- **CSS3**: Modern styling with gradients and glassmorphism

## 📂 Project Structure

```
chatbot/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── SavedProperty.js     # Mongoose schema
│   ├── routes/
│   │   ├── chat.js              # Chat API endpoint
│   │   └── properties.js        # Property save/retrieve endpoints
│   ├── services/
│   │   ├── dataLoader.js        # JSON data merging
│   │   ├── geminiService.js     # Gemini API integration
│   │   └── propertyFilter.js    # Property filtering logic
│   ├── data_sources/
│   │   ├── property_basics.json
│   │   ├── property_characteristics.json
│   │   └── property_images.json
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ChatPanel.jsx
    │   │   ├── ChatPanel.css
    │   │   ├── PropertyGrid.jsx
    │   │   ├── PropertyGrid.css
    │   │   ├── PropertyCard.jsx
    │   │   └── PropertyCard.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
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
   MONGODB_URI=mongodb://localhost:27017/real-estate-chatbot
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the backend server**:
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
  "propertyId": "prop-001",
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

## 🧠 How It Works

1. **User Input**: User types a natural language query in the chat
2. **Groq NLP**: Backend sends the message to Groq API (Llama 8B) for intent extraction
3. **Data Merging**: Backend loads and merges three JSON files (basics, characteristics, images) by `id`
4. **Filtering**: Backend filters merged properties based on extracted criteria
5. **Response**: Backend returns AI-generated response and matching properties
6. **Display**: Frontend updates chat and displays property cards

## 🎨 UI Features

- **Gradient Backgrounds**: Vibrant purple gradient theme
- **Glassmorphism**: Modern frosted glass effects
- **Smooth Animations**: Fade-in, slide-in, and hover effects
- **Typing Indicator**: Animated dots while AI is thinking
- **Auto-scroll**: Chat automatically scrolls to latest message
- **Responsive Grid**: Property cards adapt to screen size

## 📝 Sample Queries

Try these example queries:

- "Show me 3 bedroom apartments under $500,000"
- "2 bedroom condo in Miami with beach access"
- "Luxury properties with private garden"
- "Affordable 1 bedroom in New York"
- "4 bedroom house in Seattle under $1 million"
- "Penthouse with rooftop terrace"

## 🔧 Customization

### Adding Your Own Property Data

Replace the JSON files in `backend/data_sources/` with your own data:

**property_basics.json**:
```json
[
  {
    "id": "unique-id",
    "title": "Property Title",
    "price": 75,
    "location": "Location Name"
  }
]
```

**property_characteristics.json**:
```json
[
  {
    "id": "unique-id",
    "bedrooms": 3,
    "bathrooms": 2,
    "size": 1800,
    "amenities": ["Parking", "Gym"]
  }
]
```

**property_images.json**:
```json
[
  {
    "id": "unique-id",
    "images": ["url1", "url2"]
  }
]
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is updated for production
3. Deploy the `backend` folder

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API base URL in `frontend/src/App.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```
2. Build the production bundle:
   ```bash
   npm run build
   ```
3. Deploy the `build` folder

## 🐛 Troubleshooting

**MongoDB Connection Error**:
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

**Groq API Error**:
- Verify API key is correct in `.env`
- Check API quota and rate limits at https://console.groq.com/

**CORS Error**:
- Backend has CORS enabled for all origins in development
- For production, update CORS settings in `server.js`

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

Built with ❤️ using React, Node.js, MongoDB, and Groq AI (Llama 8B)
