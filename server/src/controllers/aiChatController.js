const Groq = require('groq-sdk');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { getToolsForRole } = require('../utils/aiTools');

// @desc    General AI Chat with tool calling
// @route   POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { messages } = req.body;
    const userRole = req.user ? req.user.role : 'user';

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI service not configured.' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const tools = getToolsForRole(userRole);

    const systemPrompt = `
      You are the BestBuy E-Commerce Assistant. 
      Your goal is to help users with their shopping experience or help sellers manage their business.
      
      User Role: ${userRole}
      Current User ID: ${req.user ? req.user._id : 'Anonymous'}

      GUIDELINES:
      - Be helpful, professional, and concise.
      - Use tools whenever a user asks to search, view details, add to cart, or manage products/orders.
      - IMPORTANT: Do NOT invent tools. Only use the ones provided.
      - IMPORTANT: Do NOT output XML tags like <function=...> or pseudo-code in your response. The system handles tool calling automatically via the API.
      - If you search for products, summarize the results and provide their IDs if needed.
      - For "navigate_to", use it when the user wants to see a specific page like /cart, /orders, or a product page.
      - For "add_to_cart", notify the user that you've added it (frontend will handle the actual state update via the tool command).
      - If a seller wants to update stock or price, confirm the product ID first or search for it if they provide a name.
    `;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      tools: tools,
      tool_choice: 'auto',
      max_tokens: 1024,
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
      // Process tool calls
      const toolResults = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let result = '';

        try {
          switch (functionName) {
            case 'search_products':
              const query = {};
              if (args.query) query.name = { $regex: args.query, $options: 'i' };
              if (args.category) {
                const cat = await Category.findOne({ name: { $regex: args.category, $options: 'i' } });
                if (cat) query.category = cat._id;
              }
              const products = await Product.find(query).limit(5).select('name price stock description images slug');
              result = JSON.stringify(products);
              break;

            case 'get_product_details':
              const product = await Product.findById(args.productId).populate('category', 'name');
              result = JSON.stringify(product || { error: 'Product not found' });
              break;

            case 'add_to_cart':
              // We return a "success" message to AI, and the frontend will see the tool call to update state
              result = JSON.stringify({ success: true, message: `Added product ${args.productId} to cart.` });
              break;

            case 'navigate_to':
              result = JSON.stringify({ success: true, path: args.path });
              break;

            case 'get_order_status':
              const orderFilter = { user: req.user._id };
              if (args.orderId) orderFilter._id = args.orderId;
              const userOrders = await Order.find(orderFilter).sort({ createdAt: -1 }).limit(1).populate('items.product', 'name');
              if (userOrders.length === 0) {
                result = JSON.stringify({ error: 'No orders found' });
              } else {
                const order = userOrders[0];
                result = JSON.stringify({
                  orderId: order._id,
                  status: order.status,
                  total: order.total,
                  items: order.items.map(i => i.name),
                  createdAt: order.createdAt,
                  isPaid: order.isPaid
                });
              }
              break;

            case 'update_stock':
              if (userRole !== 'seller' && userRole !== 'admin') {
                result = 'Error: Unauthorized';
              } else {
                const updatedProduct = await Product.findOneAndUpdate(
                  { _id: args.productId, seller: req.user._id },
                  { stock: args.newStock },
                  { new: true }
                );
                result = JSON.stringify(updatedProduct || { error: 'Product not found or not owned by you' });
              }
              break;

            case 'update_product_price':
              if (userRole !== 'seller' && userRole !== 'admin') {
                result = 'Error: Unauthorized';
              } else {
                const updatedPrice = await Product.findOneAndUpdate(
                  { _id: args.productId, seller: req.user._id },
                  { price: args.newPrice },
                  { new: true }
                );
                result = JSON.stringify(updatedPrice || { error: 'Product not found or not owned by you' });
              }
              break;

            case 'get_my_orders':
              if (userRole !== 'seller' && userRole !== 'admin') {
                result = 'Error: Unauthorized';
              } else {
                const orderQuery = { 'items.seller': req.user._id };
                if (args.status) orderQuery.status = args.status;
                const orders = await Order.find(orderQuery).populate('user', 'name email').limit(10);
                result = JSON.stringify(orders);
              }
              break;

            case 'update_order_status':
              if (userRole !== 'seller' && userRole !== 'admin') {
                result = 'Error: Unauthorized';
              } else {
                const order = await Order.findById(args.orderId);
                const isSeller = order?.items.some(i => i.seller?.toString() === String(req.user._id));
                if (!order || (!isSeller && userRole !== 'admin')) {
                  result = JSON.stringify({ error: 'Order not found or unauthorized' });
                } else {
                  order.status = args.status;
                  if (args.status === 'Delivered') {
                    order.isDelivered = true;
                    order.deliveredAt = new Date();
                  }
                  await order.save();
                  result = JSON.stringify({ success: true, order });
                }
              }
              break;

            case 'update_product_status':
              if (userRole !== 'seller' && userRole !== 'admin') {
                result = 'Error: Unauthorized';
              } else {
                const updatedStatus = await Product.findOneAndUpdate(
                  { _id: args.productId, seller: req.user._id },
                  { isActive: args.status !== 'Discontinued' },
                  { new: true }
                );
                result = JSON.stringify(updatedStatus || { error: 'Product not found or not owned by you' });
              }
              break;

            default:
              result = 'Unknown tool';
          }
        } catch (err) {
          result = `Error executing tool: ${err.message}`;
        }

        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          name: functionName,
          content: result,
        });
      }

      // Final completion with tool results
      const finalResponse = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [...chatMessages, responseMessage, ...toolResults],
      });

      return res.json({
        message: finalResponse.choices[0].message.content,
        toolCalls: toolCalls,
        toolResults: toolResults // Added this to send data back to frontend
      });
    }

    // Standard text response
    res.json({
      message: responseMessage.content
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ success: false, message: 'AI processing failed.' });
  }
};
