import React from 'react';
import './ComparisonModal.css';

function ComparisonModal({ properties, onClose, onRemoveProperty }) {
    if (!properties || properties.length === 0) return null;

    // Get all unique amenities across all properties
    const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))];

    return (
        <div className="comparison-modal-overlay" onClick={onClose}>
            <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
                <div className="comparison-header">
                    <h2 className="comparison-title">
                        🏘️ Property Comparison ({properties.length})
                    </h2>
                    <button className="comparison-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="comparison-content">
                    <div className="comparison-table">
                        {/* Property Images Row */}
                        <div className="comparison-row header-row">
                            <div className="comparison-label"></div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell property-cell">
                                    <div className="comparison-property-image">
                                        {property.images && property.images.length > 0 ? (
                                            <img src={property.images[0]} alt={property.title} />
                                        ) : (
                                            <div className="no-image">🏠</div>
                                        )}
                                    </div>
                                    <button
                                        className="remove-property-btn"
                                        onClick={() => onRemoveProperty(property.id)}
                                        title="Remove from comparison"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Property Title */}
                        <div className="comparison-row">
                            <div className="comparison-label">Property</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell">
                                    <strong>{property.title}</strong>
                                </div>
                            ))}
                        </div>

                        {/* Price */}
                        <div className="comparison-row highlight-row">
                            <div className="comparison-label">💰 Price</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell price-cell">
                                    <strong>${property.price?.toLocaleString()}</strong>
                                </div>
                            ))}
                        </div>

                        {/* Location */}
                        <div className="comparison-row">
                            <div className="comparison-label">📍 Location</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell">
                                    {property.location}
                                </div>
                            ))}
                        </div>

                        {/* Bedrooms */}
                        <div className="comparison-row">
                            <div className="comparison-label">🛏️ Bedrooms</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell">
                                    {property.bedrooms || 'N/A'}
                                </div>
                            ))}
                        </div>

                        {/* Bathrooms */}
                        <div className="comparison-row">
                            <div className="comparison-label">🚿 Bathrooms</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell">
                                    {property.bathrooms || 'N/A'}
                                </div>
                            ))}
                        </div>

                        {/* Size */}
                        <div className="comparison-row highlight-row">
                            <div className="comparison-label">📏 Size</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell">
                                    {property.size ? `${property.size.toLocaleString()} sqft` : 'N/A'}
                                </div>
                            ))}
                        </div>

                        {/* Amenities */}
                        <div className="comparison-row amenities-row">
                            <div className="comparison-label">✨ Amenities</div>
                            {properties.map((property) => (
                                <div key={property.id} className="comparison-cell amenities-cell">
                                    <div className="amenities-checklist">
                                        {allAmenities.map((amenity) => {
                                            const hasAmenity = property.amenities?.includes(amenity);
                                            return (
                                                <div
                                                    key={amenity}
                                                    className={`amenity-item ${hasAmenity ? 'has-amenity' : 'no-amenity'}`}
                                                >
                                                    <span className="amenity-check">
                                                        {hasAmenity ? '✓' : '✗'}
                                                    </span>
                                                    <span className="amenity-name">{amenity}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="comparison-footer">
                    <button className="comparison-clear-btn" onClick={onClose}>
                        Close Comparison
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ComparisonModal;
