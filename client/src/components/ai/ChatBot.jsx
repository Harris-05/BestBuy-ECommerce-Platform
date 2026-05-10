import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, User, Bot, ShoppingCart, Trash2 } from 'lucide-react';
import { sendChat } from '../../services/aiService';
import { addItem, openDrawer } from '../../store/cartSlice';
import api from '../../services/api';
import { resolveImage } from '../../lib/shop-utils';

const STORAGE_KEY = 'bestbuy_chat_history';
const WELCOME = { role: 'assistant', content: 'Hi! I\'m your BestBuy Assistant. How can I help you shop or manage your business today?' };

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send history + new message. Limit context to last 10
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const response = await sendChat([...history, userMessage]);
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.message,
        toolResults: response.toolResults 
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      // Handle Tool Commands (Navigation, Cart, etc.)
      if (response.toolCalls) {
        for (const call of response.toolCalls) {
          const args = JSON.parse(call.function.arguments);
          
          if (call.function.name === 'navigate_to') {
            navigate(args.path);
          }
          
          if (call.function.name === 'add_to_cart') {
            try {
              const { data: product } = await api.get(`/products/${args.productId}`);
              dispatch(addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: resolveImage(product.images?.[0] || ''),
                quantity: args.quantity || 1
              }));
              dispatch(openDrawer());
            } catch (err) {
              console.error('AI Add to Cart failed:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderToolResult = (m) => {
    if (!m.toolResults) return null;

    return m.toolResults.map((tool, idx) => {
      const data = JSON.parse(tool.content);
      
      if (tool.name === 'search_products' && Array.isArray(data)) {
        return (
          <div key={idx} className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {data.map((product) => (
              <div key={product._id} className="min-w-[160px] bg-white rounded-lg border border-border p-2 shadow-sm flex flex-col gap-1">
                <img src={resolveImage(product.images?.[0])} alt={product.name} className="h-20 w-full object-contain bg-gray-50 rounded" />
                <p className="text-[11px] font-semibold line-clamp-1">{product.name}</p>
                <p className="text-[10px] text-orange font-bold">${product.price}</p>
                <div className="flex gap-1 mt-auto">
                   <button 
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="flex-1 py-1 text-[9px] bg-navy text-white rounded hover:bg-navy-light"
                   >
                     View
                   </button>
                   <button 
                    onClick={() => {
                      dispatch(addItem({
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        image: resolveImage(product.images?.[0]),
                        quantity: 1
                      }));
                      dispatch(openDrawer());
                    }}
                    className="p-1 bg-orange text-navy rounded hover:bg-orange-hover"
                   >
                     <ShoppingCart size={12} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (tool.name === 'get_order_status' && data.orderId) {
        return (
          <div key={idx} className="mt-3 bg-white rounded-lg border-l-4 border-orange p-3 shadow-sm text-[11px]">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold">Order #{data.orderId.slice(-6).toUpperCase()}</p>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                data.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange/10 text-orange'
              }`}>
                {data.status}
              </span>
            </div>
            <p className="text-gray-500 mb-1">Total: ${data.total}</p>
            <p className="line-clamp-1 italic">Items: {data.items.join(', ')}</p>
            <button 
              onClick={() => navigate('/profile')}
              className="mt-2 w-full py-1.5 border border-border rounded hover:bg-gray-50 transition-colors"
            >
              View Order Details
            </button>
          </div>
        );
      }

      return null;
    });
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-navy text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-orange p-1.5 rounded-lg text-navy">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-sm">BestBuy Assistant</h3>
                  <p className="text-[10px] text-gray-300">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-section"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col gap-1 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        m.role === 'user' ? 'bg-orange text-navy' : 'bg-navy text-orange'
                      }`}>
                        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-navy text-white rounded-tr-none' 
                          : 'bg-white text-ink border border-border rounded-tl-none shadow-sm'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                    {renderToolResult(m)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-navy text-orange shadow-sm flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-xl rounded-tl-none border border-border shadow-sm">
                      <Loader2 size={16} className="animate-spin text-orange" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 input py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary p-2 h-10 w-10 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? 'bg-white text-navy border border-border' : 'bg-navy text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full border-2 border-white animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;
