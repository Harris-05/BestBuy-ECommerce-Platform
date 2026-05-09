'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import type { z } from 'zod'

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    await signIn('credentials', { ...data, callbackUrl: '/' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 space-y-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <div>
          <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-[#e94560] text-white py-2 rounded">Sign In</button>
        <a href="/forgot-password" className="text-sm text-[#e94560]">Forgot password?</a>
      </form>
    </div>
  )
}
