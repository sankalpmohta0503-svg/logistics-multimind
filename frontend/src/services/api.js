const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Dashboard
  getDashboard: () => fetchAPI('/dashboard'),
  
  // Warehouses
  getWarehouses: () => fetchAPI('/warehouses'),
  getWarehouse: (id) => fetchAPI(`/warehouses/${id}`),
  
  // Inventory
  getInventory: () => fetchAPI('/inventory'),
  getInventoryRisks: () => fetchAPI('/inventory/risks'),
  
  // Shipments
  getShipments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/shipments${query ? `?${query}` : ''}`);
  },
  getShipment: (id) => fetchAPI(`/shipments/${id}`),
  
  // Fleet
  getFleet: () => fetchAPI('/fleet'),
  getVehicle: (id) => fetchAPI(`/fleet/${id}`),
  
  // Analytics
  getDemandForecast: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/analytics/demand${query ? `?${query}` : ''}`);
  },
  getDelayPredictions: () => fetchAPI('/analytics/delay'),
  getCostForecast: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/analytics/cost${query ? `?${query}` : ''}`);
  },
  getWarehouseCapacityForecast: () => fetchAPI('/analytics/warehouse-capacity'),
  
  // Optimization
  optimizeRoute: (data) => fetchAPI('/optimization/route', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  optimizeFleet: (data) => fetchAPI('/optimization/fleet', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  compareMultimodal: (data) => fetchAPI('/optimization/multimodal', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  optimizeInventory: (data) => fetchAPI('/optimization/inventory', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Alerts & Recommendations
  getAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/alerts${query ? `?${query}` : ''}`);
  },
  resolveAlert: (id) => fetchAPI(`/alerts/${id}/resolve`, { method: 'PATCH' }),
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/alerts/recommendations${query ? `?${query}` : ''}`);
  },
  applyRecommendation: (id) => fetchAPI(`/alerts/recommendations/${id}/apply`, { method: 'POST' }),
  resetAlertsAndRecommendations: () => fetchAPI('/alerts/reset', { method: 'POST' }),
  
  // Reports
  getExecutiveReport: () => fetchAPI('/reports/executive'),
  getOperationalReport: () => fetchAPI('/reports/operational'),
};
