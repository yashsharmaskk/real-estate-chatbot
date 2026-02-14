import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatPanel from './components/ChatPanel';
import PropertyGrid from './components/PropertyGrid';
import CompareButton from './components/CompareButton';
import ComparisonModal from './components/ComparisonModal';
import SavedPropertiesView from './components/SavedPropertiesView';

// Backend API URL - Render production
const API_BASE_URL = 'https://real-estate-chatbot-8fdj.onrender.com/api';

function App() {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "👋 Hi! I'm your AI real estate assistant. Tell me what kind of home you're looking for!",
        },
    ]);
    const [properties, setProperties] = useState([]);
    const [savedPropertyIds, setSavedPropertyIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Comparison feature state
    const [selectedForComparison, setSelectedForComparison] = useState([]);
    const [showComparisonModal, setShowComparisonModal] = useState(false);

    // Saved properties view state
    const [savedProperties, setSavedProperties] = useState([]);
    const [showSavedView, setShowSavedView] = useState(false);

    // Load saved property IDs on mount
    useEffect(() => {
        fetchSavedPropertyIds();
    }, []);

    // Fetch saved property IDs from backend
    const fetchSavedPropertyIds = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/saved?sessionId=default-session`);
            const savedIds = response.data.properties?.map(p => p.id) || [];
            setSavedPropertyIds(savedIds);
        } catch (error) {
            console.error('Error fetching saved property IDs:', error);
        }
    };

    const handleSendMessage = async (userMessage) => {
        // Add user message to chat
        const newMessages = [...messages, { type: 'user', text: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Call chat API
            const response = await axios.post(`${API_BASE_URL}/chat`, {
                message: userMessage,
            });

            const { reply, properties: matchedProperties } = response.data;

            // Add bot response to chat
            setMessages([...newMessages, { type: 'bot', text: reply }]);

            // Update properties display
            setProperties(matchedProperties);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([
                ...newMessages,
                {
                    type: 'bot',
                    text: '❌ Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProperty = async (propertyId) => {
        try {
            if (savedPropertyIds.includes(propertyId)) {
                // Unsave property
                await axios.delete(`${API_BASE_URL}/save-property/${propertyId}`, {
                    data: { sessionId: 'default-session' },
                });
                setSavedPropertyIds(savedPropertyIds.filter(id => id !== propertyId));

                // If saved view is open, refresh it
                if (showSavedView) {
                    const response = await axios.get(`${API_BASE_URL}/saved?sessionId=default-session`);
                    setSavedProperties(response.data.properties || []);
                }
            } else {
                // Save property
                await axios.post(`${API_BASE_URL}/save-property`, {
                    propertyId,
                    sessionId: 'default-session',
                });
                setSavedPropertyIds([...savedPropertyIds, propertyId]);

                // If saved view is open, refresh it
                if (showSavedView) {
                    const response = await axios.get(`${API_BASE_URL}/saved?sessionId=default-session`);
                    setSavedProperties(response.data.properties || []);
                }
            }
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    // Comparison feature handlers
    const togglePropertyComparison = (propertyId) => {
        setSelectedForComparison(prev => {
            if (prev.includes(propertyId)) {
                // Remove from comparison
                return prev.filter(id => id !== propertyId);
            } else {
                // Add to comparison (max 3 properties)
                if (prev.length >= 3) {
                    alert('You can compare up to 3 properties at a time');
                    return prev;
                }
                return [...prev, propertyId];
            }
        });
    };

    const handleOpenComparison = () => {
        setShowComparisonModal(true);
    };

    const handleCloseComparison = () => {
        setShowComparisonModal(false);
    };

    const handleRemoveFromComparison = (propertyId) => {
        setSelectedForComparison(prev => prev.filter(id => id !== propertyId));
    };

    // Get properties selected for comparison
    const comparisonProperties = properties.filter(p =>
        selectedForComparison.includes(p.id)
    );

    // Fetch saved properties from backend
    const fetchSavedProperties = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/saved?sessionId=default-session`);
            setSavedProperties(response.data.properties || []);
            setShowSavedView(true);
        } catch (error) {
            console.error('Error fetching saved properties:', error);
            alert('Failed to load saved properties');
        }
    };

    const handleCloseSavedView = () => {
        setShowSavedView(false);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">🏡 AI Real Estate Assistant</h1>
                    <p className="app-subtitle">Find your dream home with AI-powered search</p>
                </div>
                <button className="view-saved-btn" onClick={fetchSavedProperties} title="View Saved Properties">
                    💾 Saved ({savedPropertyIds.length})
                </button>
            </header>

            <div className="app-container">
                <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                />
                <PropertyGrid
                    properties={properties}
                    savedPropertyIds={savedPropertyIds}
                    onSaveProperty={handleSaveProperty}
                    selectedForComparison={selectedForComparison}
                    onToggleComparison={togglePropertyComparison}
                />
            </div>

            {/* Comparison Feature */}
            <CompareButton
                count={selectedForComparison.length}
                onClick={handleOpenComparison}
            />

            {showComparisonModal && (
                <ComparisonModal
                    properties={comparisonProperties}
                    onClose={handleCloseComparison}
                    onRemoveProperty={handleRemoveFromComparison}
                />
            )}

            {/* Saved Properties View */}
            {showSavedView && (
                <SavedPropertiesView
                    savedProperties={savedProperties}
                    savedPropertyIds={savedPropertyIds}
                    onSaveProperty={handleSaveProperty}
                    selectedForComparison={selectedForComparison}
                    onToggleComparison={togglePropertyComparison}
                    onClose={handleCloseSavedView}
                />
            )}
        </div>
    );
}

export default App;
