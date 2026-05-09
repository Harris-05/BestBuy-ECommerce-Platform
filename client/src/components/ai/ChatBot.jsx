import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Trash2, Bot } from 'lucide-react'

const STORAGE_KEY = 'shopbot_messages'

const WELCOME = { role: 'assistant', content: 'Hi! I\'m ShopBot. Ask me anything about products, deals, or recommendations!' }

export default function ChatBot() {
  const [open, setOpen]   = useState(false)
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? [WELCOME] }
    catch { return [WELCOME] }
  })
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: updated, query: userMsg.content }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let content   = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        content += decoder.decode(value, { stream: true })
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([WELCOME])

  return (
    <>
      {/* FAB toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-navy shadow-modal flex items-center justify-center text-white"
        aria-label={open ? 'Close ShopBot' : 'Open ShopBot'}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.span>
            : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={22} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-modal border border-border flex flex-col overflow-hidden"
            style={{ height: 480 }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-navy text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-orange" />
                <div>
                  <p className="font-headline font-semibold text-body-sm">ShopBot</p>
                  <p className="text-[11px] text-gray-300">AI Shopping Assistant</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-1.5 rounded hover:bg-navy-light transition-colors"
                title="Clear chat"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-surface-section">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={13} className="text-orange" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-body-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-navy text-white rounded-br-sm'
                        : 'bg-white text-ink border border-border rounded-bl-sm shadow-card'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <Bot size={13} className="text-orange" />
                  </div>
                  <div className="bg-white border border-border rounded-lg rounded-bl-sm px-3 py-2 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-ink-faint animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-white flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask ShopBot anything…"
                className="flex-1 input py-2 text-body-sm"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="btn-primary px-3 py-2 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
