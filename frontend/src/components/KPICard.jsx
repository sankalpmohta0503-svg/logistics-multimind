import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, subtitle, trend, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          {trend.direction === 'up' && <TrendingUp className="h-4 w-4 text-success-600 mr-1" />}
          {trend.direction === 'down' && <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />}
          {trend.direction === 'neutral' && <Minus className="h-4 w-4 text-gray-600 mr-1" />}
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-success-600' : 
            trend.direction === 'down' ? 'text-danger-600' : 
            'text-gray-600'
          }`}>
            {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
