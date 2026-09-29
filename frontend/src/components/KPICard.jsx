import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';

export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon, 
  color = 'primary',
  chart,
  badge
}) {
  const iconColorClasses = {
    primary: 'bg-blue-50 text-blue-600 border border-blue-100/80',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100/80',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100/80',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100/80',
    purple: 'bg-purple-50 text-purple-600 border border-purple-100/80',
  };

  return (
    <div className="card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2.5 rounded-xl ${iconColorClasses[color] || iconColorClasses.primary}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          </div>
        </div>
        
        {badge ? (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {badge}
          </span>
        ) : (
          <div className="p-1 text-slate-300 group-hover:text-blue-500 transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium truncate">{subtitle}</p>
          )}
        </div>

        {chart && (
          <div className="w-24 h-12 flex-shrink-0 flex items-end justify-end">
            {chart}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center">
            {trend.direction === 'up' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 mr-1.5 border border-emerald-200/50">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                {trend.value}
              </span>
            )}
            {trend.direction === 'down' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 mr-1.5 border border-rose-200/50">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                {trend.value}
              </span>
            )}
            {trend.direction === 'neutral' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 mr-1.5">
                <Minus className="h-3 w-3 mr-0.5" />
                {trend.value}
              </span>
            )}
            <span className="text-slate-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
