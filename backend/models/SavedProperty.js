const mongoose = require('mongoose');

const savedPropertySchema = new mongoose.Schema({
    propertyId: {
        type: String,
        required: true,
    },
    sessionId: {
        type: String,
        default: 'default-session',
    },
    savedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create compound index to prevent duplicate saves
savedPropertySchema.index({ propertyId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model('SavedProperty', savedPropertySchema);
