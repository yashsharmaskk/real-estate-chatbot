const express = require('express');
const router = express.Router();
const { extractIntent, generateResponse } = require('../services/groqService');
const { loadAndMergeProperties } = require('../services/dataLoader');
const { filterProperties } = require('../services/propertyFilter');

/**
 * POST /api/chat
 * Process user message and return matching properties
 */
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                error: 'Message is required',
            });
        }

        console.log('📨 Received message:', message);

        // Step 1: Extract intent using Gemini
        const filters = await extractIntent(message);

        // Step 2: Load and merge property data
        const allProperties = await loadAndMergeProperties();

        // Step 3: Filter properties based on extracted criteria
        const matchingProperties = filterProperties(allProperties, filters);

        // Step 4: Generate conversational response
        const reply = await generateResponse(filters, matchingProperties.length);

        console.log(`✅ Found ${matchingProperties.length} matching properties`);

        // Step 5: Return response
        res.json({
            reply,
            properties: matchingProperties,
            filters, // Include filters for debugging
        });
    } catch (error) {
        console.error('❌ Chat API Error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            message: error.message,
        });
    }
});

module.exports = router;
