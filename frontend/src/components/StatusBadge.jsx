export default function StatusBadge({ status, type = 'default' }) {
  const statusConfig = {
    // Shipment statuses
    planned: { label: 'Planned', className: 'badge-info' },
    dispatched: { label: 'Dispatched', className: 'badge-warning' },
    in_transit: { label: 'In Transit', className: 'bg-blue-50 text-blue-700 border border-blue-200/60' },
    delivered: { label: 'Delivered', className: 'badge-success' },
    delayed: { label: 'Delayed', className: 'badge-danger' },
    at_risk: { label: 'At Risk', className: 'badge-warning' },
    
    // Vehicle statuses
    available: { label: 'Available', className: 'badge-success' },
    maintenance: { label: 'Maintenance', className: 'badge-warning' },
    
    // Risk levels
    critical: { label: 'Critical', className: 'badge-danger' },
    high: { label: 'High', className: 'badge-warning' },
    medium: { label: 'Medium', className: 'badge-info' },
    low: { label: 'Low', className: 'badge-success' },
    normal: { label: 'Normal', className: 'badge-success' },
    
    // Health statuses
    healthy: { label: 'Healthy', className: 'badge-success' },
    warning: { label: 'Needs Attention', className: 'badge-warning' },
    
    // Inventory
    overstock: { label: 'Overstock', className: 'bg-purple-50 text-purple-700 border border-purple-200/60' },
    
    // Priority
    urgent: { label: 'Urgent', className: 'badge-danger' },
    standard: { label: 'Standard', className: 'badge-info' },
    economy: { label: 'Economy', className: 'bg-slate-100 text-slate-700 border border-slate-200/60' },
  };

  const config = statusConfig[status?.toLowerCase()] || { label: status || 'Normal', className: 'badge-info' };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}
