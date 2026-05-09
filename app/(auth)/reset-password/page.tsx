'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/lib/validations/auth'
import type { z } from 'zod'

type ResetForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  })

  const onSubmit = async (data: ResetForm) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) router.push('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 space-y-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <input type="hidden" {...register('token')} />
        <div>
          <input {...register('password')} type="password" placeholder="New Password" className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-[#e94560] text-white py-2 rounded">Reset Password</button>
      </form>
    </div>
  )
}
