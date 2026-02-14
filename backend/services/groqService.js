const Groq = require('groq-sdk');

// Initialize Groq client
const apiKey = process.env.GROQ_API_KEY;

// Debug: Check if API key is loaded
if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.error('❌ GROQ_API_KEY not set or still has placeholder value!');
    console.error('   Please update backend/.env with your actual Groq API key');
} else {
    console.log('✅ Groq API Key loaded:', apiKey.substring(0, 10) + '...');
}

const groq = new Groq({
    apiKey: apiKey,
});

/**
 * Extract structured intent from user message using Groq API (Llama 8B)
 * @param {string} userMessage - Natural language query from user
 * @returns {Promise<Object>} Structured filters object
 */
async function extractIntent(userMessage) {
    try {
        const prompt = `You are a real estate search assistant. Extract search criteria from the user's message and return ONLY a valid JSON object with these exact fields:

{
  "location": "city or area name (empty string if not mentioned)",
  "bedrooms": number or null (e.g., 2, 3, 4),
  "maxPrice": number or null (in dollars, e.g., 500000 for $500k),
  "amenities": array of strings (e.g., ["parking", "gym", "pool"])
}

User message: "${userMessage}"

IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.1-8b-instant', // Llama 8B model
            temperature: 0.3,
            max_tokens: 500,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || '{}';

        // Extract JSON from response (handle cases where model adds markdown)
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const filters = JSON.parse(jsonText);

        // Validate and normalize the response
        const normalizedFilters = {
            location: filters.location || '',
            bedrooms: filters.bedrooms !== undefined ? filters.bedrooms : null,
            maxPrice: filters.maxPrice !== undefined ? filters.maxPrice : null,
            amenities: Array.isArray(filters.amenities) ? filters.amenities : [],
        };

        console.log('✅ Extracted filters:', normalizedFilters);
        return normalizedFilters;
    } catch (error) {
        console.error('❌ Groq API Error:', error.message);

        // Return default filters on error
        return {
            location: '',
            bedrooms: null,
            maxPrice: null,
            amenities: [],
        };
    }
}

/**
 * Generate a conversational response based on filters and results
 * @param {Object} filters - Extracted search filters
 * @param {number} resultCount - Number of matching properties
 * @returns {Promise<string>} AI-generated response
 */
async function generateResponse(filters, resultCount) {
    try {
        const prompt = `You are a friendly real estate assistant. Generate a brief, conversational response (1-2 sentences) about the search results.

Search criteria:
- Location: ${filters.location || 'any'}
- Bedrooms: ${filters.bedrooms || 'any'}
- Max Price: ${filters.maxPrice ? '$' + filters.maxPrice.toLocaleString() : 'any budget'}
- Amenities: ${filters.amenities.length > 0 ? filters.amenities.join(', ') : 'none specified'}

Results found: ${resultCount}

Generate a helpful, friendly response.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 150,
        });

        return chatCompletion.choices[0]?.message?.content || 'Here are your search results!';
    } catch (error) {
        console.error('❌ Response generation error:', error.message);

        // Fallback response
        if (resultCount === 0) {
            return "I couldn't find any properties matching your criteria. Try adjusting your search parameters.";
        } else if (resultCount === 1) {
            return "I found 1 property that matches your requirements!";
        } else {
            return `I found ${resultCount} properties that match what you're looking for!`;
        }
    }
}

module.exports = { extractIntent, generateResponse };
