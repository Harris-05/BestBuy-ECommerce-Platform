import { useState, useEffect, useRef } from 'react'
import { Wand2, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react'
import api from '../../services/api'

const EMPTY = { name: '', description: '', price: '', stock: '', category: '', images: [] }

export default function ProductForm({ initial, onSuccess, onCancel }) {
  const [form,    setForm]    = useState(initial ?? EMPTY)
  const [loading, setLoading] = useState(false)
  const [aiText,  setAiText]  = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [categories, setCategories] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      if (data.categories) setCategories(data.categories.map(c => c.name))
    }).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim())        errs.name        = 'Product name is required.'
    if (!form.description.trim()) errs.description = 'Description is required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Enter a valid price.'
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)  errs.stock = 'Enter a valid stock quantity.'
    if (!form.category)           errs.category    = 'Select a category.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAiFill = async () => {
    if (!aiText.trim()) return
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/parse-product', { text: aiText })
      setForm(f => ({ ...f, ...data }))
    } catch {
      // silently fail
    } finally {
      setAiLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      set('images', [...(form.images ?? []), data.url])
    } catch (err) {
      alert(err.response?.data?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (initial?._id) {
        await api.put(`/products/${initial._id}`, form)
      } else {
        await api.post('/products', form)
      }
      onSuccess?.()
    } catch (err) {
      setErrors({ _form: err.response?.data?.message ?? 'Failed to save product.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* AI Field Filler */}
      <div className="bg-orange-light border border-orange/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-orange-hover" />
          <h4 className="font-headline font-semibold text-body-sm text-ink">AI Product Filler</h4>
        </div>
        <textarea
          value={aiText}
          onChange={e => setAiText(e.target.value)}
          rows={3}
          placeholder="Describe your product in plain English and AI will fill the fields automatically…"
          className="input resize-none text-body-sm"
        />
        <button
          type="button"
          onClick={handleAiFill}
          disabled={aiLoading || !aiText.trim()}
          className="btn-primary text-body-sm py-2 px-4 disabled:opacity-50"
        >
          {aiLoading ? <><Loader2 size={14} className="animate-spin" />Filling…</> : <><Wand2 size={14} />Fill with AI</>}
        </button>
      </div>

      {errors._form && <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{errors._form}</p>}

      {/* Name */}
      <div>
        <label className="text-label-md text-ink-muted block mb-1.5">Product Name *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Bluetooth Headphones" className="input" />
        {errors.name && <p className="text-body-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="text-label-md text-ink-muted block mb-1.5">Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Detailed product description…" className="input resize-none" />
        {errors.description && <p className="text-body-sm text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-label-md text-ink-muted block mb-1.5">Price (USD) *</label>
          <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" className="input" />
          {errors.price && <p className="text-body-sm text-red-500 mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="text-label-md text-ink-muted block mb-1.5">Stock *</label>
          <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" className="input" />
          {errors.stock && <p className="text-body-sm text-red-500 mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-label-md text-ink-muted block mb-1.5">Category *</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
          <option value="">Select a category…</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-body-sm text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Images Section */}
      <div>
        <label className="text-label-md text-ink-muted block mb-1.5">Product Images</label>
        
        {/* Image Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {(form.images ?? []).map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg border border-border overflow-hidden bg-surface-dim">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          
          {/* Upload Button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-navy hover:bg-surface-section transition-all text-ink-faint hover:text-navy"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Upload size={20} />
                <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
              </>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* URL Inputs (Fallback) */}
        <div className="space-y-2">
          {(form.images ?? []).map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={url}
                onChange={e => {
                  const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs)
                }}
                placeholder="https://…"
                className="input flex-1 text-body-sm py-1.5"
              />
              <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => set('images', [...(form.images ?? []), ''])} className="text-body-sm text-navy hover:underline flex items-center gap-1.5">
            <ImageIcon size={14} /> Add image by URL
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || uploading} className="btn-primary flex-1 justify-center">
          {loading ? <><Loader2 size={15} className="animate-spin" />Saving…</> : (initial?._id ? 'Update Product' : 'Create Product')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  )
}
