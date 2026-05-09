import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const HIDDEN_KEYS = ['passwordHash', 'password', 'resetToken', 'resetTokenExp', '__v']

export default function DataTable({ data = [], columns, onEdit, onDelete, onView }) {
  const [sortKey, setSortKey]  = useState(null)
  const [sortDir, setSortDir]  = useState('asc')

  const cols = columns ?? (data.length
    ? Object.keys(data[0]).filter(k => !HIDDEN_KEYS.includes(k))
    : [])

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const va = a[sortKey]; const vb = b[sortKey]
    const cmp = String(va ?? '').localeCompare(String(vb ?? ''), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronsUpDown size={13} className="text-ink-faint" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-navy" />
      : <ChevronDown size={13} className="text-navy" />
  }

  if (!data.length) {
    return <p className="text-center text-ink-muted py-10 text-body-sm">No data found.</p>
  }

  const formatCell = (val) => {
    if (val === null || val === undefined) return '—'
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    if (typeof val === 'object') return JSON.stringify(val).slice(0, 50) + (JSON.stringify(val).length > 50 ? '…' : '')
    if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(val).toLocaleDateString()
    }
    return String(val)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-body-sm border-collapse">
        <thead>
          <tr className="bg-surface-section border-b border-border">
            {cols.map(k => (
              <th
                key={k}
                onClick={() => toggleSort(k)}
                className="text-left px-4 py-3 font-semibold text-ink-muted cursor-pointer select-none whitespace-nowrap hover:text-ink transition-colors"
              >
                <span className="flex items-center gap-1">
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                  <SortIcon k={k} />
                </span>
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="px-4 py-3 text-left font-semibold text-ink-muted">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row._id ?? row.id ?? i} className="border-b border-border hover:bg-surface-section transition-colors">
              {cols.map(k => (
                <td key={k} className="px-4 py-3 text-ink max-w-xs truncate">
                  {formatCell(row[k])}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {onView   && <button onClick={() => onView(row)}   className="text-body-sm text-navy hover:underline">View</button>}
                    {onEdit   && <button onClick={() => onEdit(row)}   className="text-body-sm text-navy hover:underline">Edit</button>}
                    {onDelete && <button onClick={() => onDelete(row)} className="text-body-sm text-red-500 hover:underline">Delete</button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
