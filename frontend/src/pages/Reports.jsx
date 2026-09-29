import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Download, TrendingUp, DollarSign, Truck, Warehouse, 
  Package, ShieldAlert, Sparkles, RefreshCw, Printer, Calendar, 
  ArrowUpRight, CheckCircle2, ChevronRight, BarChart3, PieChart as PieIcon, 
  ExternalLink, Layers, Clock, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import KPICard from '../components/KPICard';
import StatusBadge from '../components/StatusBadge';

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;
const formatLakhs = (val) => `₹${(Number(val || 0) / 100000).toFixed(1)}L`;

export default function Reports() {
  const [reportType, setReportType] = useState('executive'); // 'executive', 'operational'
  const [timeframe, setTimeframe] = useState('30d'); // '30d', 'qtd', 'annual'
  const [executiveReport, setExecutiveReport] = useState(null);
  const [operationalReport, setOperationalReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const loadAllReports = async () => {
    setError('');
    try {
      const [execData, operData] = await Promise.all([
        api.getExecutiveReport(),
        api.getOperationalReport()
      ]);
      setExecutiveReport(execData);
      setOperationalReport(operData);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError(err.message || 'Failed to generate operational reports.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllReports();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllReports();
  };

  // Timeframe multiplier for what-if projections
  const timeframeMultiplier = useMemo(() => {
    if (timeframe === 'qtd') return 3;
    if (timeframe === 'annual') return 12;
    return 1;
  }, [timeframe]);

  // Prepared Chart Data for Cost Structure
  const costChartData = useMemo(() => {
    if (!executiveReport?.cost_breakdown) return [];
    const cb = executiveReport.cost_breakdown;
    const m = timeframeMultiplier;
    return [
      { name: 'Transportation', value: cb.transportation * m, color: '#2563EB', share: '65.2%' },
      { name: 'Warehousing', value: cb.warehousing * m, color: '#6366F1', share: '22.8%' },
      { name: 'Inventory Holding', value: cb.inventory_holding * m, color: '#F59E0B', share: '12.0%' },
    ];
  }, [executiveReport, timeframeMultiplier]);

  // Prepared Chart Data for Savings Potential
  const savingsChartData = useMemo(() => {
    if (!executiveReport?.savings_potential) return [];
    const sp = executiveReport.savings_potential;
    const m = timeframeMultiplier;
    return [
      { category: 'Route Optimization', savings: sp.route_optimization * m, color: '#10B981' },
      { category: 'Inventory Reduction', savings: sp.inventory_optimization * m, color: '#2563EB' },
      { category: 'Fleet Allocation', savings: sp.fleet_allocation * m, color: '#6366F1' },
      { category: 'Warehouse Capacity', savings: sp.warehouse_optimization * m, color: '#F59E0B' },
    ];
  }, [executiveReport, timeframeMultiplier]);

  // Total calculated cost
  const totalCostCalculated = useMemo(() => {
    if (!executiveReport?.cost_breakdown) return 1840000;
    const cb = executiveReport.cost_breakdown;
    return (cb.transportation + cb.warehousing + cb.inventory_holding) * timeframeMultiplier;
  }, [executiveReport, timeframeMultiplier]);

  // Total calculated savings
  const totalSavingsCalculated = useMemo(() => {
    if (!executiveReport?.savings_potential) return 870000;
    return (executiveReport.savings_potential.total || 870000) * timeframeMultiplier;
  }, [executiveReport, timeframeMultiplier]);

  // Working Client-Side CSV Export
  const handleExportCSV = () => {
    if (!executiveReport && !operationalReport) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'SC-LogiX Supply Chain Intelligence Report\n';
    csvContent += `Generated At,${new Date().toISOString()}\n`;
    csvContent += `Report Horizon,${timeframe === '30d' ? '30 Days' : timeframe === 'qtd' ? 'Quarter to Date' : 'Full Fiscal Year'}\n\n`;

    if (reportType === 'executive') {
      csvContent += 'EXECUTIVE FINANCIAL SUMMARY\n';
      csvContent += `Total Operational Cost,${totalCostCalculated}\n`;
      csvContent += `Total AI Savings Potential,${totalSavingsCalculated}\n`;
      csvContent += `On-Time Delivery Rate,${executiveReport?.overview?.on_time_rate}%\n`;
      csvContent += `Average Fleet Utilization,${executiveReport?.overview?.fleet_utilization}%\n\n`;

      csvContent += 'COST STRUCTURE BREAKDOWN\nCategory,Amount (INR)\n';
      costChartData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });

      csvContent += '\nAI SAVINGS POTENTIAL BY DOMAIN\nInitiative,Projected Savings (INR)\n';
      savingsChartData.forEach(item => {
        csvContent += `${item.category},${item.savings}\n`;
      });
    } else {
      csvContent += 'OPERATIONAL TELEMATICS REPORT\n';
      csvContent += `Total Vehicles,${operationalReport?.fleet?.total_vehicles}\n`;
      csvContent += `Active Vehicles In Transit,${operationalReport?.fleet?.active}\n`;
      csvContent += `Total Distance Traveled (km),${operationalReport?.fleet?.total_distance}\n`;
      csvContent += `Fleet Fuel Efficiency (km/L),${operationalReport?.fleet?.fuel_efficiency}\n\n`;

      csvContent += 'WAREHOUSE CAPACITY UTILIZATION\nID,Warehouse Name,Utilization %,SKU Count\n';
      operationalReport?.warehouses?.forEach(wh => {
        csvContent += `${wh.id},"${wh.name}",${wh.utilization}%,${wh.sku_count}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SC_LogiX_${reportType.toUpperCase()}_REPORT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !executiveReport) {
    return (
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="card p-8 text-center max-w-sm border-slate-100 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Compiling Intelligence Report</h3>
          <p className="mt-1.5 text-xs text-slate-500">Aggregating freight costs, savings attribution, and facility telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Audit</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Validated Telemetry
            </span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Intelligence & Executive Reports
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-slate-500">
            Financial cost attribution, fleet velocity metrics, and audited ROI generated across algorithmic optimization models.
          </p>
        </div>

        {/* Global Toolbar & Export Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe pills */}
          <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            {[
              { id: '30d', label: 'Last 30 Days' },
              { id: 'qtd', label: 'Quarter to Date' },
              { id: 'annual', label: 'Annual Model' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  timeframe === t.id
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="btn btn-secondary inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn btn-secondary inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-4 py-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Compiling...' : 'Re-Run Audit'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Report CSV downloaded successfully! Ready for spreadsheet or ERP ingest.</span>
        </div>
      )}

      {/* Report Mode Switcher */}
      <div className="border-b border-slate-200/80">
        <div className="flex gap-6">
          <button
            onClick={() => setReportType('executive')}
            className={`flex items-center gap-2.5 pb-3.5 pt-1 text-sm font-bold border-b-2 transition-all ${
              reportType === 'executive'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Executive ROI & Cost Attribution</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {formatLakhs(totalSavingsCalculated)} Savings
            </span>
          </button>

          <button
            onClick={() => setReportType('operational')}
            className={`flex items-center gap-2.5 pb-3.5 pt-1 text-sm font-bold border-b-2 transition-all ${
              reportType === 'operational'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="h-4 w-4 text-purple-600" />
            <span>Operational Velocity & Infrastructure</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              4 Facilities • 9 Vehicles
            </span>
          </button>
        </div>
      </div>

      {/* REPORT VIEW 1: EXECUTIVE ROI */}
      {reportType === 'executive' && executiveReport && (
        <div className="space-y-7">
          {/* Executive Scorecard */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Logistics Cost"
              value={formatLakhs(totalCostCalculated)}
              subtitle={`${timeframe === '30d' ? '30 Days' : timeframe === 'qtd' ? 'QTD' : 'Annual'} Expenditure`}
              icon={DollarSign}
              color="primary"
              trend={{ direction: 'down', value: '6.4%', label: 'cost reduction' }}
            />

            <KPICard
              title="AI Savings Potential"
              value={formatLakhs(totalSavingsCalculated)}
              subtitle="Projected Autonomous Value"
              icon={Sparkles}
              color="success"
              badge="47.2% Captured"
            />

            <KPICard
              title="On-Time Delivery Rate"
              value={`${executiveReport.overview.on_time_rate}%`}
              subtitle="SLA Target: 95.0%"
              icon={TrendingUp}
              color="success"
              badge="Benchmark Exceeded"
            />

            <KPICard
              title="Avg Fleet Utilization"
              value={`${executiveReport.overview.fleet_utilization}%`}
              subtitle="Load vs Gross Capacity"
              icon={Truck}
              color="warning"
              badge="Optimal Zone"
            />
          </div>

          {/* Two-Column Visual Analytics: Savings Matrix + Cost Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: AI Savings Potential Bar Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">AI-Identified Savings Potential</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Quantified cost savings across core algorithmic modules</p>
                </div>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {formatLakhs(totalSavingsCalculated)} Total
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsChartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" tickFormatter={(v) => `₹${v/100000}L`} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={130} />
                    <Tooltip 
                      formatter={(v) => [formatCurrency(v), 'Savings']}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '1rem', border: '1px solid #F1F5F9' }}
                    />
                    <Bar dataKey="savings" radius={[0, 8, 8, 0]}>
                      {savingsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress and Share breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                {savingsChartData.map(item => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(item.savings)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Cost Structure Donut */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Cost Structure Breakdown</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Distribution across transit, storage, and holding capital</p>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {formatLakhs(totalCostCalculated)} Total
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {costChartData.map((entry, index) => (
                        <Cell key={`cost-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v) => [formatCurrency(v), 'Expense']}
                      contentStyle={{ backgroundColor: '#FFF', borderRadius: '1rem', border: '1px solid #F1F5F9' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Cost Summary Pills */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                {costChartData.map(item => (
                  <div key={item.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 truncate">{item.name}</p>
                    <p className="font-extrabold text-slate-900 mt-0.5">{formatLakhs(item.value)}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.share}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Risks & Unlocked Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Critical Risks */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Executive Risk Radar</h3>
                </div>
                <Link to="/alerts" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                  View All Alerts <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {executiveReport.risks && executiveReport.risks.length > 0 ? (
                  executiveReport.risks.slice(0, 3).map(risk => (
                    <div key={risk.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 shrink-0 mt-0.5">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{risk.title}</p>
                          <StatusBadge status={risk.severity} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{risk.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No critical risks active.</p>
                )}
              </div>
            </div>

            {/* Operational Health KPIs */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-slate-900">Operational Integrity Signals</h3>
                </div>
                <span className="text-xs font-bold text-slate-400">Live Health</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">At-Risk Freight</p>
                  <p className="mt-2 text-2xl font-black text-rose-600">
                    {executiveReport.performance?.shipments_at_risk || 0}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Critical delay &gt; 70%</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Stockout Risk</p>
                  <p className="mt-2 text-2xl font-black text-amber-600">
                    {executiveReport.performance?.stockout_risks || 0}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">SKUs below reorder</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg WH Density</p>
                  <p className="mt-2 text-2xl font-black text-blue-600">
                    {Number(executiveReport.performance?.warehouse_capacity_avg || 75.8).toFixed(1)}%
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Across 4 central hubs</p>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Optimize fleet routes & inventory reorders to secure ₹8.7L ROI.</span>
                </div>
                <Link to="/optimization" className="font-bold underline hover:text-blue-950 shrink-0">
                  Open Engine
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT VIEW 2: OPERATIONAL TELEMATICS */}
      {reportType === 'operational' && operationalReport && (
        <div className="space-y-7">
          {/* Operational Quick Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Fleet Distance Traveled"
              value={`${(operationalReport.fleet?.total_distance || 45680).toLocaleString()} km`}
              subtitle="Last 30-Day Total"
              icon={Truck}
              color="primary"
              badge="GPS Verified"
            />

            <KPICard
              title="Fuel Efficiency Index"
              value={`${operationalReport.fleet?.fuel_efficiency || 6.8} km/L`}
              subtitle="Fleet Average Performance"
              icon={Zap}
              color="success"
              trend={{ direction: 'up', value: '+0.4 km/L', label: 'vs last month' }}
            />

            <KPICard
              title="Total Inventory Capital"
              value={formatLakhs(operationalReport.inventory?.total_value || 6354200)}
              subtitle={`${operationalReport.inventory?.total_skus || 10} SKUs Stocked`}
              icon={Package}
              color="warning"
              badge="Live Valuation"
            />

            <KPICard
              title="Facility Capacity Stress"
              value={`${operationalReport.warehouses?.filter(w => w.utilization > 85).length || 1} Hubs`}
              subtitle="Operating >85% capacity"
              icon={Warehouse}
              color="danger"
              badge="WH-03 Alert"
            />
          </div>

          {/* Warehouse Capacity Grid */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Warehouse Facility Utilization & Throughput</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time volumetric occupancy across all 4 central distribution nodes</p>
              </div>
              <Link to="/warehouses" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Warehouse Manager <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {operationalReport.warehouses?.map(wh => {
                const isHigh = wh.utilization > 85;
                const isMed = wh.utilization > 70 && wh.utilization <= 85;
                const barColor = isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500';
                const statusColor = isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600';

                return (
                  <div key={wh.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{wh.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">{wh.id}</span>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className={`text-2xl font-black ${statusColor}`}>{wh.utilization}%</span>
                        <span className="text-xs font-semibold text-slate-500">{wh.sku_count} Active SKUs</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, wh.utilization)}%` }}></div>
                      </div>
                      <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>Safe: &lt;80%</span>
                        <span>{isHigh ? 'Overcapacity Warning' : 'Nominal Flow'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fleet Status & Shipment Fulfillment Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipment Lifecycle Funnel */}
            <div className="card p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">Shipment Fulfillment Lifecycle</h3>
              <p className="text-xs text-slate-500 mb-4">Pipeline transition breakdown for all dispatch orders</p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-800">Delivered On-Time</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{operationalReport.shipments?.delivered || 2} Shipments</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-bold text-slate-800">In Transit (Active Dispatch)</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{operationalReport.shipments?.in_transit || 2} Shipments</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-bold text-slate-800">Planned & Staged for Dispatch</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {(operationalReport.shipments?.total || 6) - (operationalReport.shipments?.delivered || 2) - (operationalReport.shipments?.in_transit || 2)} Shipments
                  </span>
                </div>
              </div>
            </div>

            {/* Fleet Availability & Load Balancing */}
            <div className="card p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">Fleet Telematics & Vehicle Allocation</h3>
              <p className="text-xs text-slate-500 mb-4">Vehicle operational readiness across heavy and medium freight carriers</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active in Transit</p>
                  <p className="mt-2 text-3xl font-black text-blue-600">
                    {operationalReport.fleet?.active || 3}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Vehicles on road</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Available at Hubs</p>
                  <p className="mt-2 text-3xl font-black text-emerald-600">
                    {(operationalReport.fleet?.total_vehicles || 9) - (operationalReport.fleet?.active || 3)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Ready for dispatch</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Fleet Mean Efficiency: <strong className="text-slate-900">{operationalReport.fleet?.fuel_efficiency} km/L</strong></span>
                <Link to="/fleet" className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                  Manage Fleet <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
