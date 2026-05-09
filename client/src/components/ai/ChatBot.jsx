'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Trash2 } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const STORAGE_KEY = 'shopbot_messages'

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: updated, query: input }),
      headers: { 'Content-Type': 'application/json' },
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let assistantContent = ''
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      assistantContent += decoder.decode(value)
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }])
    }

    setLoading(false)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#e94560] text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 450 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Header */}
            <div className="bg-[#1a1a2e] text-white px-4 py-3 flex justify-between items-center">
              <span className="font-medium">ShopBot</span>
              <button onClick={() => setMessages([])}><Trash2 size={16} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.length === 0 && (
                <p className="text-center text-gray-400 mt-10">Hi! How can I help you find something today?</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-[#e94560] text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 pl-2">
                  {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask ShopBot..."
                className="flex-1 border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e94560]"
              />
              <button onClick={send} className="bg-[#e94560] text-white p-2 rounded"><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
