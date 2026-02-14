const express = require('express');
const router = express.Router();
const SavedProperty = require('../models/SavedProperty');
const { loadAndMergeProperties } = require('../services/dataLoader');

/**
 * POST /api/save-property
 * Save a property to MongoDB
 */
router.post('/save-property', async (req, res) => {
    try {
        const { propertyId, sessionId = 'default-session' } = req.body;

        if (!propertyId) {
            return res.status(400).json({ error: 'Property ID is required' });
        }

        // Check if already saved
        const existing = await SavedProperty.findOne({ propertyId, sessionId });
        if (existing) {
            return res.json({
                message: 'Property already saved',
                saved: true,
            });
        }

        // Save new property
        const savedProperty = new SavedProperty({
            propertyId,
            sessionId,
        });

        await savedProperty.save();

        console.log(`✅ Saved property: ${propertyId}`);

        res.json({
            message: 'Property saved successfully',
            saved: true,
        });
    } catch (error) {
        console.error('❌ Save property error:', error);
        res.status(500).json({
            error: 'Failed to save property',
            message: error.message,
        });
    }
});

/**
 * DELETE /api/save-property/:propertyId
 * Remove a saved property
 */
router.delete('/save-property/:propertyId', async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { sessionId = 'default-session' } = req.body;

        await SavedProperty.deleteOne({ propertyId, sessionId });

        console.log(`✅ Removed saved property: ${propertyId}`);

        res.json({
            message: 'Property removed from saved',
            saved: false,
        });
    } catch (error) {
        console.error('❌ Remove property error:', error);
        res.status(500).json({
            error: 'Failed to remove property',
            message: error.message,
        });
    }
});

/**
 * GET /api/saved
 * Get all saved properties with full details
 */
router.get('/saved', async (req, res) => {
    try {
        const { sessionId = 'default-session' } = req.query;

        // Get saved property IDs
        const savedProperties = await SavedProperty.find({ sessionId });
        const savedIds = savedProperties.map(sp => sp.propertyId);

        if (savedIds.length === 0) {
            return res.json({ properties: [] });
        }

        // Load all properties and filter by saved IDs
        const allProperties = await loadAndMergeProperties();
        const savedPropertiesWithDetails = allProperties.filter(prop =>
            savedIds.includes(String(prop.id))
        );

        console.log(`✅ Retrieved ${savedPropertiesWithDetails.length} saved properties`);

        res.json({
            properties: savedPropertiesWithDetails,
        });
    } catch (error) {
        console.error('❌ Get saved properties error:', error);
        res.status(500).json({
            error: 'Failed to retrieve saved properties',
            message: error.message,
        });
    }
});

module.exports = router;
