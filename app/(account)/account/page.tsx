import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-playfair text-3xl font-bold mb-6">My Account</h1>
      <div className="border p-6 rounded space-y-2">
        <p><span className="font-medium">Name:</span> {session.user.name}</p>
        <p><span className="font-medium">Email:</span> {session.user.email}</p>
        <p><span className="font-medium">Role:</span> {session.user.role}</p>
      </div>
      <a href="/account/orders" className="inline-block mt-6 text-[#e94560] underline">View My Orders</a>
    </div>
  )
}
