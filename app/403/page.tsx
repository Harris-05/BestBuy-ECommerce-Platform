export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold text-[#e94560]">403</h1>
      <p className="text-xl text-gray-600">You do not have permission to access this page.</p>
      <a href="/" className="text-[#e94560] underline">Go home</a>
    </div>
  )
}
