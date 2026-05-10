const Groq = require('groq-sdk');

// @desc    Parse product description using AI
// @route   POST /api/ai/parse-product
exports.parseProduct = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a longer description (min 10 chars).' });
    }

    if (!process.env.GROQ_API_KEY) {
      // Fallback if no API key is provided
      return res.json({
        name: text.split(' ').slice(0, 4).join(' '),
        description: text,
        price: 19.99,
        stock: 10,
        category: 'Electronics'
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      Extract structured product data from the following description.
      Description: "${text}"

      Return ONLY a JSON object with these fields:
      - name: string (short, catchy)
      - description: string (polished version of the input)
      - price: number
      - stock: number (default to 10 if not mentioned)
      - category: string (one of: Electronics, Clothing, Books, Home & Kitchen, Sports, Beauty, Toys, Automotive)

      JSON format only, no extra text.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('AI Parse Error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed.' });
  }
};
