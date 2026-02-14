import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

function ChatPanel({ messages, onSendMessage, isLoading }) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="chat-header-icon">💬</div>
                <div>
                    <h2 className="chat-title">Chat Assistant</h2>
                    <p className="chat-status">
                        {isLoading ? 'Thinking...' : 'Online'}
                    </p>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.type === 'user' ? 'message-user' : 'message-bot'}`}
                    >
                        <div className="message-bubble">
                            {message.text}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message message-bot">
                        <div className="message-bubble typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Tell me what kind of home you're looking for..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="chat-send-button"
                    disabled={!inputValue.trim() || isLoading}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default ChatPanel;
