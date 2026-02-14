import React from 'react';
import './SavedPropertiesView.css';
import PropertyCard from './PropertyCard';

function SavedPropertiesView({
    savedProperties,
    savedPropertyIds,
    onSaveProperty,
    selectedForComparison,
    onToggleComparison,
    onClose
}) {
    return (
        <div className="saved-properties-overlay" onClick={onClose}>
            <div className="saved-properties-modal" onClick={(e) => e.stopPropagation()}>
                <div className="saved-properties-header">
                    <div className="header-content">
                        <h2 className="saved-properties-title">
                            💾 Saved Properties ({savedProperties.length})
                        </h2>
                        <p className="saved-properties-subtitle">
                            Your favorite properties
                        </p>
                    </div>
                    <button className="close-saved-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="saved-properties-content">
                    {savedProperties.length === 0 ? (
                        <div className="empty-saved-state">
                            <div className="empty-icon">📭</div>
                            <h3>No Saved Properties</h3>
                            <p>Start saving properties by clicking the bookmark icon on property cards!</p>
                        </div>
                    ) : (
                        <div className="saved-properties-grid">
                            {savedProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    isSaved={savedPropertyIds.includes(property.id)}
                                    onSave={() => onSaveProperty(property.id)}
                                    isSelectedForComparison={selectedForComparison?.includes(property.id)}
                                    onToggleComparison={() => onToggleComparison(property.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SavedPropertiesView;
