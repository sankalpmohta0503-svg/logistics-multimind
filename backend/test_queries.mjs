// Analysis-only script. Does NOT modify anything.
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SQL = await initSqlJs();
const dbPath = join(__dirname, 'sclogix.db');
const buffer = readFileSync(dbPath);
const DB = new SQL.Database(buffer);

function queryAll(sql, params = []) {
  try {
    const stmt = DB.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    const results = [];
    while (stmt.step()) results.push(stmt.getAsObject());
    stmt.free();
    return { ok: true, rows: results };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

function queryGet(sql, params = []) {
  try {
    const stmt = DB.prepare(sql);
    if (params.length > 0) stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return { ok: true, row };
    }
    stmt.free();
    return { ok: true, row: null };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

// Test all queries used by each route
const tests = [
  {
    name: 'warehouses - main query',
    q: `SELECT w.*, ROUND((w.occupied * 100.0 / w.capacity), 1) as utilization,
        (SELECT COUNT(*) FROM inventory WHERE warehouse_id = w.id) as sku_count,
        (SELECT SUM(i.quantity * p.unit_price) FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.warehouse_id = w.id) as inventory_value
        FROM warehouses w ORDER BY w.id`
  },
  {
    name: 'shipments - main query',
    q: `SELECT s.*, w.name as origin_name, v.type as vehicle_type, r.name as route_name, r.distance_km, r.duration_hours
        FROM shipments s
        LEFT JOIN warehouses w ON s.origin_warehouse_id = w.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        LEFT JOIN routes r ON s.route_id = r.id
        WHERE 1=1 ORDER BY s.created_at DESC`
  },
  {
    name: 'fleet - vehicles with utilization',
    q: `SELECT v.*, ROUND((v.current_load_kg * 100.0 / v.capacity_kg), 1) as utilization,
        (SELECT COUNT(*) FROM shipments WHERE vehicle_id = v.id AND status IN ('dispatched', 'in_transit')) as active_shipments
        FROM vehicles v ORDER BY v.id`
  },
  {
    name: 'alerts - main query',
    q: `SELECT * FROM alerts WHERE 1=1 ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END, created_at DESC`
  },
  {
    name: 'analytics/delay - shipments join',
    q: `SELECT s.*, r.congestion_level, r.distance_km, v.capacity_kg
        FROM shipments s
        LEFT JOIN routes r ON s.route_id = r.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        WHERE s.status IN ('dispatched', 'in_transit')`
  },
  {
    name: 'analytics/demand - products list',
    q: `SELECT * FROM products LIMIT 10`
  },
  {
    name: 'analytics/demand - demand history',
    q: `SELECT date, quantity FROM demand_history WHERE product_id = ? ORDER BY date DESC LIMIT 90`,
    params: ['PRD-001']
  },
  {
    name: 'analytics/cost - historical costs',
    q: `SELECT date(created_at) as date, SUM(cost) as total_cost FROM shipments WHERE created_at > date('now', '-90 days') GROUP BY date(created_at) ORDER BY date DESC`
  },
  {
    name: 'reports/executive - total cost',
    q: `SELECT SUM(cost) as total FROM shipments WHERE created_at > date('now', '-30 days')`
  },
  {
    name: 'reports/executive - alerts',
    q: `SELECT * FROM alerts WHERE resolved = 0 AND severity IN ('critical', 'high') ORDER BY severity, created_at DESC LIMIT 5`
  },
  {
    name: 'reports/executive - recommendations',
    q: `SELECT * FROM recommendations WHERE applied = 0 ORDER BY estimated_savings DESC LIMIT 5`
  },
  {
    name: 'reports/executive - warehouse capacity avg',
    q: `SELECT AVG(occupied * 100.0 / capacity) as avg FROM warehouses`
  },
  {
    name: 'dashboard - totalShipments',
    q: `SELECT COUNT(*) as count FROM shipments`
  },
  {
    name: 'dashboard - deliveredShipments',
    q: `SELECT COUNT(*) as total, SUM(CASE WHEN delivered_at <= eta THEN 1 ELSE 0 END) as onTime FROM shipments WHERE status = 'delivered'`
  },
  {
    name: 'inventory/risks - main query',
    q: `SELECT i.*, p.sku, p.name, p.category, p.reorder_point, p.lead_time_days, w.name as warehouse_name,
        (SELECT AVG(quantity) FROM demand_history WHERE product_id = p.id AND date > date('now', '-30 days')) as avg_daily_demand
        FROM inventory i JOIN products p ON i.product_id = p.id JOIN warehouses w ON i.warehouse_id = w.id`
  },
  {
    name: 'optimization/route - routes lookup',
    q: `SELECT * FROM routes WHERE origin LIKE ? AND destination LIKE ?`,
    params: ['%Mumbai%', '%Pune%']
  },
];

console.log('=== DATABASE QUERY ANALYSIS ===\n');
let failCount = 0;
for (const t of tests) {
  let result;
  if (t.q.includes('?') && t.params) {
    result = queryAll(t.q, t.params);
  } else {
    result = queryAll(t.q);
  }
  if (result.ok) {
    console.log(`✓ ${t.name}: ${result.rows.length} rows returned`);
    if (result.rows.length > 0) {
      const keys = Object.keys(result.rows[0]);
      console.log(`  Fields: ${keys.join(', ')}`);
    }
  } else {
    console.log(`✗ ${t.name}: FAILED - ${result.error}`);
    failCount++;
  }
}

// Check table row counts
console.log('\n=== TABLE COUNTS ===');
const tables = ['warehouses', 'products', 'inventory', 'vehicles', 'routes', 'shipments', 'alerts', 'recommendations', 'demand_history', 'orders', 'suppliers'];
for (const t of tables) {
  const r = queryGet(`SELECT COUNT(*) as count FROM ${t}`);
  if (r.ok) console.log(`  ${t}: ${r.row.count} rows`);
  else console.log(`  ${t}: ERROR - ${r.error}`);
}

console.log(`\n=== SUMMARY: ${failCount} failed queries ===`);
DB.close();
