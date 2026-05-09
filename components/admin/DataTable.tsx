'use client'

type DataTableProps = {
  data: Record<string, any>[]
  type: 'products' | 'orders' | 'users'
}

export function DataTable({ data, type }: DataTableProps) {
  if (!data.length) return <p className="text-center text-gray-500 py-8">No data found.</p>

  const keys = Object.keys(data[0]).filter(k => !['passwordHash', 'resetToken', 'resetTokenExp'].includes(k))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            {keys.map(k => (
              <th key={k} className="text-left px-4 py-3 font-medium text-gray-600 capitalize">
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
            <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {keys.map(k => (
                <td key={k} className="px-4 py-3 text-gray-700">
                  {typeof row[k] === 'object' ? JSON.stringify(row[k]).slice(0, 40) : String(row[k] ?? '')}
                </td>
              ))}
              <td className="px-4 py-3">
                <button className="text-[#e94560] text-xs hover:underline">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
