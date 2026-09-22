export function seedDatabase(db) {
  // Check if data already exists
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM warehouses').get();
    if (count && count.count > 0) {
      console.log('✓ Database already seeded, skipping');
      return;
    }
  } catch (e) {
    // Table doesn't exist yet, continue with seeding
  }

  console.log('🌱 Seeding database...');

  // Clear existing data
  db.exec('DELETE FROM recommendations');
  db.exec('DELETE FROM alerts');
  db.exec('DELETE FROM demand_history');
  db.exec('DELETE FROM shipments');
  db.exec('DELETE FROM orders');
  db.exec('DELETE FROM inventory');
  db.exec('DELETE FROM vehicles');
  db.exec('DELETE FROM routes');
  db.exec('DELETE FROM products');
  db.exec('DELETE FROM warehouses');
  db.exec('DELETE FROM suppliers');

  // Seed Suppliers
  const suppliers = [
    { id: 'SUP-001', name: 'TechParts India', contact: '+91-9876543210', lead_time_days: 7, reliability_score: 0.92 },
    { id: 'SUP-002', name: 'Global Electronics', contact: '+91-9876543211', lead_time_days: 10, reliability_score: 0.88 },
    { id: 'SUP-003', name: 'Asian Components', contact: '+91-9876543212', lead_time_days: 5, reliability_score: 0.95 },
    { id: 'SUP-004', name: 'Metro Supplies', contact: '+91-9876543213', lead_time_days: 3, reliability_score: 0.97 },
    { id: 'SUP-005', name: 'Western Traders', contact: '+91-9876543214', lead_time_days: 8, reliability_score: 0.85 },
  ];

  const supplierStmt = db.prepare('INSERT INTO suppliers VALUES (?, ?, ?, ?, ?)');
  suppliers.forEach(s => supplierStmt.run(s.id, s.name, s.contact, s.lead_time_days, s.reliability_score));

  // Seed Warehouses
  const warehouses = [
    { id: 'WH-01', name: 'Mumbai Central Hub', location: 'Mumbai, Maharashtra', capacity: 10000, occupied: 7800, lat: 19.0760, lng: 72.8777, status: 'active' },
    { id: 'WH-02', name: 'Delhi Distribution Center', location: 'Delhi NCR', capacity: 12000, occupied: 9200, lat: 28.7041, lng: 77.1025, status: 'active' },
    { id: 'WH-03', name: 'Bangalore Tech Warehouse', location: 'Bangalore, Karnataka', capacity: 8000, occupied: 7100, lat: 12.9716, lng: 77.5946, status: 'active' },
    { id: 'WH-04', name: 'Chennai Coastal Hub', location: 'Chennai, Tamil Nadu', capacity: 9000, occupied: 5400, lat: 13.0827, lng: 80.2707, status: 'active' },
  ];

  const warehouseStmt = db.prepare('INSERT INTO warehouses VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  warehouses.forEach(w => warehouseStmt.run(w.id, w.name, w.location, w.capacity, w.occupied, w.lat, w.lng, w.status));

  // Seed Products
  const products = [
    { id: 'PRD-001', sku: 'SKU-1001', name: 'Electronic Component A', category: 'Electronics', unit_price: 450, reorder_point: 500, lead_time_days: 7, supplier_id: 'SUP-001' },
    { id: 'PRD-002', sku: 'SKU-1002', name: 'Electronic Component B', category: 'Electronics', unit_price: 680, reorder_point: 400, lead_time_days: 7, supplier_id: 'SUP-002' },
    { id: 'PRD-003', sku: 'SKU-1003', name: 'Mechanical Part X', category: 'Mechanical', unit_price: 320, reorder_point: 600, lead_time_days: 5, supplier_id: 'SUP-003' },
    { id: 'PRD-004', sku: 'SKU-1004', name: 'Mechanical Part Y', category: 'Mechanical', unit_price: 550, reorder_point: 450, lead_time_days: 5, supplier_id: 'SUP-003' },
    { id: 'PRD-005', sku: 'SKU-1005', name: 'Assembly Unit Z', category: 'Assembly', unit_price: 1200, reorder_point: 300, lead_time_days: 10, supplier_id: 'SUP-002' },
    { id: 'PRD-006', sku: 'SKU-2001', name: 'Industrial Tool A', category: 'Tools', unit_price: 890, reorder_point: 250, lead_time_days: 8, supplier_id: 'SUP-004' },
    { id: 'PRD-007', sku: 'SKU-2002', name: 'Industrial Tool B', category: 'Tools', unit_price: 1050, reorder_point: 200, lead_time_days: 8, supplier_id: 'SUP-004' },
    { id: 'PRD-008', sku: 'SKU-2048', name: 'Critical Component M', category: 'Electronics', unit_price: 1450, reorder_point: 600, lead_time_days: 7, supplier_id: 'SUP-001' },
    { id: 'PRD-009', sku: 'SKU-3001', name: 'Packaging Material', category: 'Supplies', unit_price: 85, reorder_point: 1000, lead_time_days: 3, supplier_id: 'SUP-005' },
    { id: 'PRD-010', sku: 'SKU-3002', name: 'Shipping Crate', category: 'Supplies', unit_price: 180, reorder_point: 800, lead_time_days: 3, supplier_id: 'SUP-005' },
  ];

  const productStmt = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  products.forEach(p => productStmt.run(p.id, p.sku, p.name, p.category, p.unit_price, p.reorder_point, p.lead_time_days, p.supplier_id));

  // Seed Inventory (with intentional problems)
  const inventory = [
    // WH-01 - Mumbai
    { id: 'INV-001', warehouse_id: 'WH-01', product_id: 'PRD-001', quantity: 780, last_updated: new Date().toISOString() },
    { id: 'INV-002', warehouse_id: 'WH-01', product_id: 'PRD-002', quantity: 920, last_updated: new Date().toISOString() },
    { id: 'INV-003', warehouse_id: 'WH-01', product_id: 'PRD-003', quantity: 1850, last_updated: new Date().toISOString() }, // Overstock
    { id: 'INV-004', warehouse_id: 'WH-01', product_id: 'PRD-008', quantity: 480, last_updated: new Date().toISOString() }, // At risk (SKU-2048)
    
    // WH-02 - Delhi
    { id: 'INV-005', warehouse_id: 'WH-02', product_id: 'PRD-001', quantity: 340, last_updated: new Date().toISOString() }, // Below reorder
    { id: 'INV-006', warehouse_id: 'WH-02', product_id: 'PRD-004', quantity: 680, last_updated: new Date().toISOString() },
    { id: 'INV-007', warehouse_id: 'WH-02', product_id: 'PRD-005', quantity: 420, last_updated: new Date().toISOString() },
    { id: 'INV-008', warehouse_id: 'WH-02', product_id: 'PRD-006', quantity: 180, last_updated: new Date().toISOString() }, // Below reorder
    
    // WH-03 - Bangalore (high capacity)
    { id: 'INV-009', warehouse_id: 'WH-03', product_id: 'PRD-002', quantity: 2200, last_updated: new Date().toISOString() }, // Overstock
    { id: 'INV-010', warehouse_id: 'WH-03', product_id: 'PRD-007', quantity: 850, last_updated: new Date().toISOString() },
    { id: 'INV-011', warehouse_id: 'WH-03', product_id: 'PRD-008', quantity: 120, last_updated: new Date().toISOString() }, // Critical - very low
    
    // WH-04 - Chennai
    { id: 'INV-012', warehouse_id: 'WH-04', product_id: 'PRD-009', quantity: 1580, last_updated: new Date().toISOString() },
    { id: 'INV-013', warehouse_id: 'WH-04', product_id: 'PRD-010', quantity: 1120, last_updated: new Date().toISOString() },
  ];

  const inventoryStmt = db.prepare('INSERT INTO inventory VALUES (?, ?, ?, ?, ?)');
  inventory.forEach(i => inventoryStmt.run(i.id, i.warehouse_id, i.product_id, i.quantity, i.last_updated));

  // Seed Demand History (for forecasting)
  const demandHistoryStmt = db.prepare('INSERT INTO demand_history (product_id, date, quantity) VALUES (?, ?, ?)');
  
  products.forEach(product => {
    const avgDemand = Math.floor(Math.random() * 100) + 30;
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.4;
      const quantity = Math.max(10, Math.floor(avgDemand * (1 + variation)));
      demandHistoryStmt.run(product.id, date.toISOString().split('T')[0], quantity);
    }
  });

  // Seed Vehicles
  const vehicles = [
    { id: 'V-101', type: 'Truck', capacity_kg: 5000, fuel_efficiency: 6.5, status: 'in_transit', current_load_kg: 4200, driver_name: 'Rajesh Kumar', maintenance_due: '2024-12-15' },
    { id: 'V-102', type: 'Truck', capacity_kg: 5000, fuel_efficiency: 6.8, status: 'available', current_load_kg: 0, driver_name: 'Amit Sharma', maintenance_due: '2024-11-20' },
    { id: 'V-103', type: 'Van', capacity_kg: 2000, fuel_efficiency: 12.0, status: 'in_transit', current_load_kg: 1600, driver_name: 'Priya Singh', maintenance_due: '2024-10-25' },
    { id: 'V-104', type: 'Heavy Truck', capacity_kg: 8000, fuel_efficiency: 4.5, status: 'available', current_load_kg: 0, driver_name: 'Suresh Patel', maintenance_due: '2025-01-10' },
    { id: 'V-105', type: 'Truck', capacity_kg: 5000, fuel_efficiency: 7.2, status: 'in_transit', current_load_kg: 3800, driver_name: 'Deepak Verma', maintenance_due: '2024-12-01' },
    { id: 'V-204', type: 'Truck', capacity_kg: 5500, fuel_efficiency: 7.5, status: 'available', current_load_kg: 0, driver_name: 'Anil Yadav', maintenance_due: '2024-11-30' },
    { id: 'V-205', type: 'Van', capacity_kg: 2200, fuel_efficiency: 11.5, status: 'available', current_load_kg: 0, driver_name: 'Neha Gupta', maintenance_due: '2024-12-20' },
    { id: 'V-206', type: 'Refrigerated', capacity_kg: 4500, fuel_efficiency: 5.8, status: 'maintenance', current_load_kg: 0, driver_name: 'Vikram Joshi', maintenance_due: '2024-10-15' },
    { id: 'V-307', type: 'Truck', capacity_kg: 5000, fuel_efficiency: 7.8, status: 'available', current_load_kg: 0, driver_name: 'Karan Singh', maintenance_due: '2024-12-05' },
  ];

  const vehicleStmt = db.prepare('INSERT INTO vehicles VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  vehicles.forEach(v => vehicleStmt.run(v.id, v.type, v.capacity_kg, v.fuel_efficiency, v.status, v.current_load_kg, v.driver_name, v.maintenance_due));

  // Seed Routes
  const routes = [
    { id: 'RT-001', name: 'Mumbai-Delhi Express', origin: 'Mumbai', destination: 'Delhi', distance_km: 1420, duration_hours: 22.5, congestion_level: 'medium', fuel_cost: 85200 },
    { id: 'RT-002', name: 'Mumbai-Bangalore Highway', origin: 'Mumbai', destination: 'Bangalore', distance_km: 985, duration_hours: 16.2, congestion_level: 'low', fuel_cost: 59100 },
    { id: 'RT-003', name: 'Delhi-Chennai Route', origin: 'Delhi', destination: 'Chennai', distance_km: 2180, duration_hours: 34.0, congestion_level: 'high', fuel_cost: 130800 },
    { id: 'RT-004', name: 'Bangalore-Chennai Coastal', origin: 'Bangalore', destination: 'Chennai', distance_km: 350, duration_hours: 6.5, congestion_level: 'low', fuel_cost: 21000 },
    { id: 'RT-A', name: 'Route A (Current)', origin: 'Mumbai', destination: 'Pune', distance_km: 412, duration_hours: 8.67, congestion_level: 'high', fuel_cost: 28600 },
    { id: 'RT-B', name: 'Route B (Optimized)', origin: 'Mumbai', destination: 'Pune', distance_km: 386, duration_hours: 6.92, congestion_level: 'low', fuel_cost: 21900 },
  ];

  const routeStmt = db.prepare('INSERT INTO routes VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  routes.forEach(r => routeStmt.run(r.id, r.name, r.origin, r.destination, r.distance_km, r.duration_hours, r.congestion_level, r.fuel_cost));

  // Seed Shipments (with some at-risk shipments)
  const now = new Date();
  const shipments = [
    // At-risk shipment - high delay probability
    { id: 'SHP-1048', order_id: 'ORD-1048', origin_warehouse_id: 'WH-01', destination: 'Pune Industrial Area', destination_lat: 18.5204, destination_lng: 73.8567, vehicle_id: 'V-101', route_id: 'RT-A', status: 'in_transit', priority: 'high', weight_kg: 4200, cost: 28600, created_at: new Date(now - 2*24*60*60*1000).toISOString(), dispatched_at: new Date(now - 1*24*60*60*1000).toISOString(), eta: new Date(now + 8*60*60*1000).toISOString(), delivered_at: null, delay_probability: 0.82 },
    
    // Normal shipments
    { id: 'SHP-1049', order_id: 'ORD-1049', origin_warehouse_id: 'WH-02', destination: 'Gurgaon Tech Park', destination_lat: 28.4595, destination_lng: 77.0266, vehicle_id: 'V-103', route_id: 'RT-001', status: 'in_transit', priority: 'normal', weight_kg: 1600, cost: 12400, created_at: new Date(now - 3*24*60*60*1000).toISOString(), dispatched_at: new Date(now - 2*24*60*60*1000).toISOString(), eta: new Date(now + 6*60*60*1000).toISOString(), delivered_at: null, delay_probability: 0.18 },
    
    { id: 'SHP-1050', order_id: 'ORD-1050', origin_warehouse_id: 'WH-03', destination: 'Chennai Port', destination_lat: 13.0827, destination_lng: 80.2707, vehicle_id: 'V-105', route_id: 'RT-004', status: 'dispatched', priority: 'urgent', weight_kg: 3800, cost: 21000, created_at: new Date(now - 1*24*60*60*1000).toISOString(), dispatched_at: new Date(now - 6*60*60*1000).toISOString(), eta: new Date(now + 4*60*60*1000).toISOString(), delivered_at: null, delay_probability: 0.65 },
    
    // Delivered shipments
    { id: 'SHP-1045', order_id: 'ORD-1045', origin_warehouse_id: 'WH-01', destination: 'Pune', destination_lat: 18.5204, destination_lng: 73.8567, vehicle_id: 'V-102', route_id: 'RT-A', status: 'delivered', priority: 'normal', weight_kg: 2100, cost: 15600, created_at: new Date(now - 10*24*60*60*1000).toISOString(), dispatched_at: new Date(now - 9*24*60*60*1000).toISOString(), eta: new Date(now - 8*24*60*60*1000).toISOString(), delivered_at: new Date(now - 8*24*60*60*1000 + 2*60*60*1000).toISOString(), delay_probability: 0.15 },
    
    { id: 'SHP-1046', order_id: 'ORD-1046', origin_warehouse_id: 'WH-02', destination: 'Noida', destination_lat: 28.5355, destination_lng: 77.3910, vehicle_id: 'V-104', route_id: 'RT-001', status: 'delivered', priority: 'normal', weight_kg: 5200, cost: 18900, created_at: new Date(now - 8*24*60*60*1000).toISOString(), dispatched_at: new Date(now - 7*24*60*60*1000).toISOString(), eta: new Date(now - 6*24*60*60*1000).toISOString(), delivered_at: new Date(now - 6*24*60*60*1000).toISOString(), delay_probability: 0.08 },
    
    // Planned shipments
    { id: 'SHP-1092', order_id: 'ORD-1092', origin_warehouse_id: 'WH-03', destination: 'Hyderabad Tech City', destination_lat: 17.3850, destination_lng: 78.4867, vehicle_id: null, route_id: null, status: 'planned', priority: 'normal', weight_kg: 4200, cost: null, created_at: new Date().toISOString(), dispatched_at: null, eta: null, delivered_at: null, delay_probability: null },
  ];

  const shipmentStmt = db.prepare('INSERT INTO shipments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  shipments.forEach(s => shipmentStmt.run(s.id, s.order_id, s.origin_warehouse_id, s.destination, s.destination_lat, s.destination_lng, s.vehicle_id, s.route_id, s.status, s.priority, s.weight_kg, s.cost, s.created_at, s.dispatched_at, s.eta, s.delivered_at, s.delay_probability));

  // Seed Alerts
  const alerts = [
    { id: 'ALT-001', type: 'shipment_delay', severity: 'critical', title: 'Shipment SHP-1048 High Delay Risk', description: 'Shipment has 82% probability of delay due to route congestion and tight delivery window', entity_id: 'SHP-1048', entity_type: 'shipment', created_at: new Date().toISOString(), resolved: 0 },
    { id: 'ALT-002', type: 'inventory_stockout', severity: 'high', title: 'Critical Component M (SKU-2048) Stockout Risk', description: 'Current stock of 480 units at WH-01 may run out in 5 days based on demand forecast', entity_id: 'PRD-008', entity_type: 'product', created_at: new Date().toISOString(), resolved: 0 },
    { id: 'ALT-003', type: 'warehouse_capacity', severity: 'high', title: 'Warehouse WH-03 Approaching Capacity', description: 'Current utilization at 88.8%. Projected to reach 94% within 9 days', entity_id: 'WH-03', entity_type: 'warehouse', created_at: new Date().toISOString(), resolved: 0 },
    { id: 'ALT-004', type: 'inventory_stockout', severity: 'medium', title: 'Electronic Component A Below Reorder Point', description: 'Stock at WH-02 has fallen below reorder point', entity_id: 'PRD-001', entity_type: 'product', created_at: new Date(now - 2*60*60*1000).toISOString(), resolved: 0 },
  ];

  const alertStmt = db.prepare('INSERT INTO alerts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  alerts.forEach(a => alertStmt.run(a.id, a.type, a.severity, a.title, a.description, a.entity_id, a.entity_type, a.created_at, a.resolved));

  // Seed AI Recommendations
  const recommendations = [
    { id: 'REC-001', type: 'route_optimization', priority: 'critical', title: 'Optimize Route for Shipment SHP-1048', description: 'Reassign to Vehicle V-204 and use Route B to reduce delay probability from 82% to 19%', entity_id: 'SHP-1048', estimated_savings: 6700, estimated_time_savings: 1.75, action_payload: JSON.stringify({ route_id: 'RT-B', vehicle_id: 'V-204' }), created_at: new Date().toISOString(), applied: 0, applied_at: null },
    { id: 'REC-002', type: 'inventory_reorder', priority: 'high', title: 'Urgent Reorder: Critical Component M (SKU-2048)', description: 'Reorder 1200 units immediately to prevent stockout. Current stock: 480 units, Days remaining: 4.4', entity_id: 'PRD-008', estimated_savings: 82000, estimated_time_savings: null, action_payload: JSON.stringify({ product_id: 'PRD-008', quantity: 1200 }), created_at: new Date().toISOString(), applied: 0, applied_at: null },
    { id: 'REC-003', type: 'warehouse_redistribution', priority: 'high', title: 'Redistribute Inventory from WH-03', description: 'Move 720 units of SKU group to WH-01 to reduce capacity from projected 96% to 81%', entity_id: 'WH-03', estimated_savings: 32000, estimated_time_savings: null, action_payload: JSON.stringify({ from_warehouse: 'WH-03', to_warehouse: 'WH-01', quantity: 720 }), created_at: new Date().toISOString(), applied: 0, applied_at: null },
    { id: 'REC-004', type: 'fleet_allocation', priority: 'medium', title: 'Optimize Fleet Allocation for SHP-1092', description: 'Assign Vehicle V-307 for better fuel efficiency and cost savings', entity_id: 'SHP-1092', estimated_savings: 4200, estimated_time_savings: 0.5, action_payload: JSON.stringify({ shipment_id: 'SHP-1092', vehicle_id: 'V-307' }), created_at: new Date().toISOString(), applied: 0, applied_at: null },
    { id: 'REC-005', type: 'route_optimization', priority: 'medium', title: 'Alternative Route for SHP-1050', description: 'Consider coastal route to avoid traffic congestion', entity_id: 'SHP-1050', estimated_savings: 3800, estimated_time_savings: 1.2, action_payload: JSON.stringify({ route_id: 'RT-004' }), created_at: new Date().toISOString(), applied: 0, applied_at: null },
  ];

  const recommendationStmt = db.prepare('INSERT INTO recommendations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  recommendations.forEach(r => recommendationStmt.run(r.id, r.type, r.priority, r.title, r.description, r.entity_id, r.estimated_savings, r.estimated_time_savings, r.action_payload, r.created_at, r.applied, r.applied_at));

  console.log('✓ Database seeded successfully');
  console.log(`  - ${suppliers.length} suppliers`);
  console.log(`  - ${warehouses.length} warehouses`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${inventory.length} inventory records`);
  console.log(`  - ${vehicles.length} vehicles`);
  console.log(`  - ${routes.length} routes`);
  console.log(`  - ${shipments.length} shipments`);
  console.log(`  - ${alerts.length} alerts`);
  console.log(`  - ${recommendations.length} AI recommendations`);
}
