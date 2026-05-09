'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/lib/validations/auth'
import type { z } from 'zod'
import { useRouter } from 'next/navigation'

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) router.push('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 space-y-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <div>
          <input {...register('name')} placeholder="Full Name" className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('email')} placeholder="Email" className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className="w-full border p-2 rounded" />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full bg-[#e94560] text-white py-2 rounded">Sign Up</button>
      </form>
    </div>
  )
}
