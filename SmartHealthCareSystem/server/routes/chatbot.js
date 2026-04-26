const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const router = express.Router();

const SYSTEM_PROMPT = `You are a helpful medical health assistant chatbot for the Smart Health Analyzer app. 

RULES:
1. You can answer general health and medicine questions
2. You can provide general dosage guidance for safe, non-prescription (OTC) medicines only
3. You can give lifestyle, diet, and exercise advice
4. You MUST NOT provide prescription drug advice
5. You MUST NOT diagnose diseases — only provide general health information
6. You MUST always include a disclaimer that this is not a substitute for professional medical advice
7. Be friendly, clear, and use simple language
8. If asked about serious symptoms, always recommend consulting a doctor
9. You can suggest home remedies (Gharelu Upchar) when appropriate
10. Support answering in both English and Hindi if the user asks in Hindi

DISCLAIMER to include at the end of every response:
"⚕️ Disclaimer: This is for informational purposes only and is not a substitute for professional medical advice. Please consult a qualified healthcare provider for medical concerns."`;

// POST /api/chatbot — send a message to the chatbot
router.post('/', auth, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      res.json({
        reply: response.choices[0].message.content,
        disclaimer: '⚕️ This is for informational purposes only and is not a substitute for professional medical advice.'
      });
    } catch (apiError) {
      // Fallback response when API key is not configured
      const fallbackResponses = {
        default: `Thank you for your question! Here are some general health tips:

🏃 **Stay Active**: Try to get at least 30 minutes of moderate exercise daily.
🥗 **Eat Well**: Focus on fruits, vegetables, whole grains, and lean proteins.
💧 **Stay Hydrated**: Drink 8-10 glasses of water daily.
😴 **Sleep Well**: Aim for 7-8 hours of quality sleep.
🧘 **Manage Stress**: Practice meditation or deep breathing exercises.

For specific medical concerns, please consult a healthcare professional.

⚕️ Disclaimer: This is for informational purposes only and is not a substitute for professional medical advice. Please consult a qualified healthcare provider for medical concerns.`
      };

      res.json({
        reply: fallbackResponses.default,
        disclaimer: '⚕️ This is for informational purposes only and is not a substitute for professional medical advice.',
        note: 'AI service temporarily unavailable. Showing general health advice.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
