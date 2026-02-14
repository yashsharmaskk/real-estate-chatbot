import React from 'react';
import './PropertyCard.css';

function PropertyCard({ property, isSaved, onSave, isSelectedForComparison, onToggleComparison }) {
    const formatPrice = (price) => {
        return `$${price.toLocaleString()}`;
    };

    const primaryImage = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

    return (
        <div className={`property-card ${isSelectedForComparison ? 'selected-for-comparison' : ''}`}>
            <div className="property-image-container">
                <img
                    src={primaryImage}
                    alt={property.title}
                    className="property-image"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
                    }}
                />
                <button
                    className={`save-button ${isSaved ? 'saved' : ''}`}
                    onClick={onSave}
                    title={isSaved ? 'Remove from saved' : 'Save property'}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isSaved ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
                <div className="property-price">{formatPrice(property.price)}</div>

                {/* Comparison Checkbox */}
                {onToggleComparison && (
                    <button
                        className={`compare-checkbox ${isSelectedForComparison ? 'checked' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComparison();
                        }}
                        title={isSelectedForComparison ? 'Remove from comparison' : 'Add to comparison'}
                    >
                        <span className="checkbox-icon">
                            {isSelectedForComparison ? '✓' : '⚖️'}
                        </span>
                        <span className="checkbox-label">Compare</span>
                    </button>
                )}
            </div>

            <div className="property-content">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">📍 {property.location}</p>

                <div className="property-details">
                    <div className="property-detail-item">
                        <span className="detail-icon">🛏️</span>
                        <span className="detail-text">{property.bedrooms} Beds</span>
                    </div>
                    <div className="property-detail-item">
                        <span className="detail-icon">🚿</span>
                        <span className="detail-text">{property.bathrooms} Baths</span>
                    </div>
                    <div className="property-detail-item">
                        <span className="detail-icon">📏</span>
                        <span className="detail-text">{property.size} sqft</span>
                    </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                    <div className="property-amenities">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="amenity-tag">
                                {amenity}
                            </span>
                        ))}
                        {property.amenities.length > 3 && (
                            <span className="amenity-tag more">
                                +{property.amenities.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertyCard;
