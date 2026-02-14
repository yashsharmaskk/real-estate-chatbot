/**
 * Filter properties based on extracted criteria
 * @param {Array} properties - All available properties
 * @param {Object} filters - Search filters from Gemini
 * @returns {Array} Filtered properties
 */
function filterProperties(properties, filters) {
    return properties.filter(property => {
        // Location filter (case-insensitive partial match)
        if (filters.location && filters.location.trim() !== '') {
            const locationMatch = property.location
                .toLowerCase()
                .includes(filters.location.toLowerCase());
            if (!locationMatch) return false;
        }

        // Bedrooms filter (exact match)
        if (filters.bedrooms !== null && filters.bedrooms !== undefined) {
            if (property.bedrooms !== filters.bedrooms) return false;
        }

        // Max price filter (less than or equal)
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
            if (property.price > filters.maxPrice) return false;
        }

        // Amenities filter (property must have all requested amenities)
        if (filters.amenities && filters.amenities.length > 0) {
            const propertyAmenities = property.amenities.map(a => a.toLowerCase());
            const hasAllAmenities = filters.amenities.every(requestedAmenity =>
                propertyAmenities.some(propAmenity =>
                    propAmenity.includes(requestedAmenity.toLowerCase())
                )
            );
            if (!hasAllAmenities) return false;
        }

        return true;
    });
}

module.exports = { filterProperties };
