'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '@/lib/validations/product'
import type { z } from 'zod'

type ProductFormData = z.infer<typeof productSchema>

type Props = {
  initial?: Partial<ProductFormData> & { id?: string }
  onSuccess?: () => void
}

export function ProductForm({ initial, onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initial,
  })

  const onSubmit = async (data: ProductFormData) => {
    const url = initial?.id ? `/api/products/${initial.id}` : '/api/products'
    const method = initial?.id ? 'PUT' : 'POST'
    await fetch(url, { method, body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('name')} placeholder="Product name" className="w-full border p-2 rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <textarea {...register('description')} placeholder="Description" className="w-full border p-2 rounded h-24 resize-none" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="Price" className="w-full border p-2 rounded" />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
          <input {...register('stock', { valueAsNumber: true })} type="number" placeholder="Stock" className="w-full border p-2 rounded" />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>
      </div>
      <button type="submit" className="bg-[#e94560] text-white px-6 py-2 rounded">
        {initial?.id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}
