import { AlertTriangle, AlertCircle, Info, CheckCircle, ArrowRight, Zap, Clock, DollarSign, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function AIDecisionCard({ 
  severity = 'medium', 
  title, 
  description, 
  reason, 
  recommendation, 
  impact, 
  onViewAnalysis, 
  onApply,
  isApplying = false
}) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      badgeText: 'Critical Priority',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      iconBoxClass: 'bg-rose-50 text-rose-600 border border-rose-100',
      leftBar: 'border-l-rose-500',
    },
    high: {
      icon: AlertCircle,
      badgeText: 'High Priority',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      iconBoxClass: 'bg-amber-50 text-amber-600 border border-amber-100',
      leftBar: 'border-l-amber-500',
    },
    medium: {
      icon: Info,
      badgeText: 'Medium Priority',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      iconBoxClass: 'bg-blue-50 text-blue-600 border border-blue-100',
      leftBar: 'border-l-blue-500',
    },
    low: {
      icon: CheckCircle,
      badgeText: 'Low Priority',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      iconBoxClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      leftBar: 'border-l-emerald-500',
    }
  };

  const config = severityConfig[severity] || severityConfig.medium;
  const Icon = config.icon;

  return (
    <div className={`card p-5 border-l-4 ${config.leftBar} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${config.iconBoxClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badgeClass}`}>
              {config.badgeText}
            </span>
          </div>
          
          {description && (
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
          )}

          {reason && reason.length > 0 && (
            <div className="mt-3.5 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Root Cause / Factors</p>
              <ul className="mt-1.5 space-y-1">
                {reason.map((item, index) => (
                  <li key={index} className="text-xs text-slate-600 flex items-start">
                    <span className="mr-1.5 text-slate-400 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation && (
            <div className="mt-3.5 p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">AI Suggested Action</p>
                <p className="mt-0.5 text-xs font-medium text-blue-800 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          )}

          {impact && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {impact.cost && (
                <div className="bg-emerald-50/60 rounded-xl p-2.5 border border-emerald-100">
                  <div className="flex items-center text-[11px] font-semibold text-emerald-700">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                    Est. Savings
                  </div>
                  <p className="mt-0.5 text-base font-bold text-emerald-900">{impact.cost}</p>
                </div>
              )}
              {impact.time && (
                <div className="bg-blue-50/60 rounded-xl p-2.5 border border-blue-100">
                  <div className="flex items-center text-[11px] font-semibold text-blue-700">
                    <Clock className="h-3.5 w-3.5 mr-0.5" />
                    Time Saved
                  </div>
                  <p className="mt-0.5 text-base font-bold text-blue-900">{impact.time}</p>
                </div>
              )}
              {impact.risk && (
                <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-100">
                  <div className="flex items-center text-[11px] font-semibold text-amber-700">
                    <ShieldAlert className="h-3.5 w-3.5 mr-0.5" />
                    Risk Reduction
                  </div>
                  <p className="mt-0.5 text-base font-bold text-amber-900">{impact.risk}</p>
                </div>
              )}
              {impact.efficiency && (
                <div className="bg-purple-50/60 rounded-xl p-2.5 border border-purple-100">
                  <div className="flex items-center text-[11px] font-semibold text-purple-700">
                    <Zap className="h-3.5 w-3.5 mr-0.5" />
                    Efficiency
                  </div>
                  <p className="mt-0.5 text-base font-bold text-purple-900">{impact.efficiency}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
            {onApply && (
              <button 
                onClick={onApply} 
                disabled={isApplying}
                className="btn btn-primary inline-flex items-center text-xs py-2 px-4 shadow-sm"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                    Apply Recommendation
                  </>
                )}
              </button>
            )}
            {onViewAnalysis && (
              <button onClick={onViewAnalysis} className="btn btn-secondary inline-flex items-center text-xs py-2 px-4">
                View Deep Analysis
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
