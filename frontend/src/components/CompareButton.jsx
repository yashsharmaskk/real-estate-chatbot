import React from 'react';
import './CompareButton.css';

function CompareButton({ count, onClick }) {
    if (count === 0) return null;

    return (
        <button className="compare-floating-button" onClick={onClick}>
            <span className="compare-icon">⚖️</span>
            <span className="compare-text">
                Compare {count} {count === 1 ? 'Property' : 'Properties'}
            </span>
            {count > 0 && <span className="compare-badge">{count}</span>}
        </button>
    );
}

export default CompareButton;
