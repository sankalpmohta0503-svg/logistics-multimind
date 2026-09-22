import { AlertTriangle, AlertCircle, Info, CheckCircle, ArrowRight } from 'lucide-react';

export default function AIDecisionCard({ 
  severity = 'medium', 
  title, 
  description, 
  reason, 
  recommendation, 
  impact, 
  onViewAnalysis, 
  onApply 
}) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bgColor: 'bg-danger-50',
      borderColor: 'border-danger-200',
      iconColor: 'text-danger-600',
      badgeColor: 'badge-danger'
    },
    high: {
      icon: AlertCircle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      iconColor: 'text-warning-600',
      badgeColor: 'badge-warning'
    },
    medium: {
      icon: Info,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconColor: 'text-primary-600',
      badgeColor: 'badge-info'
    },
    low: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconColor: 'text-success-600',
      badgeColor: 'badge-success'
    }
  };

  const config = severityConfig[severity] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={`card border-l-4 ${config.borderColor} p-5`}>
      <div className="flex items-start">
        <div className={`p-2 rounded-lg ${config.bgColor} ${config.iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className={`badge ${config.badgeColor} uppercase`}>{severity}</span>
          </div>
          
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}

          {reason && reason.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Why?</p>
              <ul className="mt-2 space-y-1">
                {reason.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900">AI Recommendation</p>
              <p className="mt-1 text-sm text-purple-700">{recommendation}</p>
            </div>
          )}

          {impact && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {impact.cost && (
                <div className="bg-success-50 rounded-lg p-3 border border-success-200">
                  <p className="text-xs font-medium text-success-700">Cost Savings</p>
                  <p className="mt-1 text-lg font-bold text-success-900">{impact.cost}</p>
                </div>
              )}
              {impact.time && (
                <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
                  <p className="text-xs font-medium text-primary-700">Time Saved</p>
                  <p className="mt-1 text-lg font-bold text-primary-900">{impact.time}</p>
                </div>
              )}
              {impact.risk && (
                <div className="bg-warning-50 rounded-lg p-3 border border-warning-200">
                  <p className="text-xs font-medium text-warning-700">Risk Reduction</p>
                  <p className="mt-1 text-lg font-bold text-warning-900">{impact.risk}</p>
                </div>
              )}
              {impact.efficiency && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs font-medium text-purple-700">Efficiency Gain</p>
                  <p className="mt-1 text-lg font-bold text-purple-900">{impact.efficiency}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex space-x-3">
            {onApply && (
              <button onClick={onApply} className="btn btn-primary">
                Apply Recommendation
              </button>
            )}
            {onViewAnalysis && (
              <button onClick={onViewAnalysis} className="btn btn-secondary flex items-center">
                View Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
