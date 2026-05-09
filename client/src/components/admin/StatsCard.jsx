import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, subtitle, trend, trendLabel, icon: Icon, color = 'navy' }) {
  const colorMap = {
    navy:   'bg-navy text-white',
    orange: 'bg-orange text-navy-deep',
    green:  'bg-green-600 text-white',
    red:    'bg-red-600 text-white',
  }

  return (
    <div className="card p-5 flex items-start gap-4">
      {Icon && (
        <div className={`p-3 rounded-lg ${colorMap[color]} flex-shrink-0`}>
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-label-md text-ink-muted uppercase tracking-wide">{title}</p>
        <p className="font-headline font-bold text-headline-md text-ink mt-0.5">{value}</p>
        {subtitle && <p className="text-body-sm text-ink-faint mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-label-sm ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}% {trendLabel ?? 'vs last month'}
          </div>
        )}
      </div>
    </div>
  )
}
