/**
 * Frontend Gemini AI service
 * Used for direct AI features in the UI (chat widget, insights)
 * Falls back gracefully if API key not set
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const ARIA_SYSTEM = `You are ARIA (AI Recruitment & HR Intelligence Assistant) for SmartHR Nexus.
You are a professional, empathetic HR assistant. Be concise and helpful.
You can help with: leave policies, attendance, payroll queries, performance reviews, recruitment,
HR compliance, onboarding/offboarding, employee benefits, and general HR guidance.
Keep responses short and actionable. Use bullet points when listing multiple items.`;

/**
 * Send a chat message to Gemini and get a response
 * @param {Array} messages - [{role:'user'|'assistant', content:'...'}]
 * @param {Object} context - {role, name, department}
 */
export const chatWithGemini = async (messages, context = {}) => {
  if (!GEMINI_API_KEY) {
    return "⚠️ ARIA AI is not configured. Please add VITE_GEMINI_API_KEY to your frontend .env file to enable AI chat.";
  }

  try {
    const contextNote = `\n[User: ${context.name || 'Employee'} | Role: ${context.role || 'employee'} | Dept: ${context.department || 'Unknown'}]`;

    // Build Gemini contents array
    const contents = messages.map((m, i) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: i === 0 && m.role === 'user'
        ? `${ARIA_SYSTEM}${contextNote}\n\n${m.content}`
        : m.content
      }],
    }));

    const res = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 2048,
          topP:            0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Gemini error:', err);
      if (res.status === 400) return "I couldn't process that request. Please rephrase your question.";
      if (res.status === 429) return "I'm handling too many requests right now. Please try again in a moment.";
      return "I'm having trouble connecting. Please try again shortly.";
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't get a response. Please try again.";
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return "Connection error. Please check your internet and try again.";
  }
};

/**
 * Generate a quick AI insight for a given topic
 */
export const getQuickInsight = async (topic, data) => {
  if (!GEMINI_API_KEY) return null;
  try {
    const prompt = `As an HR AI, give a 1-sentence insight about: ${topic}. Data: ${JSON.stringify(data)}. Be concise.`;
    const res = await fetch(GEMINI_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role:'user', parts:[{text:prompt}] }], generationConfig:{ maxOutputTokens:100 } }),
    });
    if (!res.ok) return null;
    const data2 = await res.json();
    return data2.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch { return null; }
};

export default { chatWithGemini, getQuickInsight };
