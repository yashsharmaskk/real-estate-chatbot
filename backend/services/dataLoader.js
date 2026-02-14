const fs = require('fs').promises;
const path = require('path');

/**
 * Load and merge property data from three JSON sources
 * @returns {Promise<Array>} Merged property objects
 */
async function loadAndMergeProperties() {
    try {
        const dataDir = path.join(__dirname, '../data_sources');

        // Load all three JSON files
        const [basicsData, characteristicsData, imagesData] = await Promise.all([
            fs.readFile(path.join(dataDir, 'property_basics.json'), 'utf8'),
            fs.readFile(path.join(dataDir, 'property_characteristics.json'), 'utf8'),
            fs.readFile(path.join(dataDir, 'property_images.json'), 'utf8'),
        ]);

        const basics = JSON.parse(basicsData);
        const characteristics = JSON.parse(characteristicsData);
        const images = JSON.parse(imagesData);

        // Create maps for efficient lookup
        const characteristicsMap = new Map(
            characteristics.map(item => [item.id, item])
        );
        const imagesMap = new Map(
            images.map(item => [item.id, item])
        );

        // Merge all data using id as the key
        const mergedProperties = basics.map(basic => {
            const char = characteristicsMap.get(basic.id) || {};
            const img = imagesMap.get(basic.id) || {};

            return {
                id: basic.id,
                title: basic.title,
                price: basic.price, // Price in dollars from original data
                location: basic.location,
                bedrooms: char.bedrooms || 0,
                bathrooms: char.bathrooms || 0,
                size: char.size_sqft || 0, // Using size_sqft from characteristics
                amenities: char.amenities || [],
                images: img.image_url ? [img.image_url] : [], // Convert single image_url to array
            };
        });

        console.log(`✅ Loaded and merged ${mergedProperties.length} properties`);
        return mergedProperties;
    } catch (error) {
        console.error('❌ Error loading property data:', error.message);
        throw new Error('Failed to load property data');
    }
}

module.exports = { loadAndMergeProperties };
