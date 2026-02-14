import React from 'react';
import PropertyCard from './PropertyCard';
import './PropertyGrid.css';

function PropertyGrid({ properties, savedPropertyIds, onSaveProperty, selectedForComparison, onToggleComparison }) {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Filter properties based on search term (Real-Time Search)
    const filteredProperties = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="property-grid-container">
            <div className="property-grid-header">
                <div className="header-top">
                    <h2 className="property-grid-title">
                        {filteredProperties.length > 0
                            ? `${filteredProperties.length} Properties Found`
                            : 'Search Results'}
                    </h2>
                    <div className="search-filter-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="real-time-search"
                            placeholder="Filter properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="property-grid">
                {filteredProperties.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            {searchTerm ? '🔍' : '🏠'}
                        </div>
                        <h3 className="empty-state-title">
                            {searchTerm ? 'No matches found' : 'No properties yet'}
                        </h3>
                        <p className="empty-state-text">
                            {searchTerm
                                ? `No properties match "${searchTerm}"`
                                : 'Start chatting to find your dream home!'}
                        </p>
                    </div>
                ) : (
                    properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            isSaved={savedPropertyIds.includes(property.id)}
                            onSave={() => onSaveProperty(property.id)}
                            isSelectedForComparison={selectedForComparison?.includes(property.id)}
                            onToggleComparison={() => onToggleComparison(property.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default PropertyGrid;
