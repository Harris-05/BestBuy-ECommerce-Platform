export function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
