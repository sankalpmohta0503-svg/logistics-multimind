export function initDatabase(db) {
  // Warehouses
  db.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      occupied INTEGER NOT NULL,
      lat REAL,
      lng REAL,
      status TEXT DEFAULT 'active'
    )
  `);

  // Products/SKUs
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      unit_price REAL,
      reorder_point INTEGER,
      lead_time_days INTEGER,
      supplier_id TEXT
    )
  `);

  // Inventory
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      warehouse_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      last_updated TEXT,
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Vehicles
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      capacity_kg REAL NOT NULL,
      fuel_efficiency REAL,
      status TEXT DEFAULT 'available',
      current_load_kg REAL DEFAULT 0,
      driver_name TEXT,
      maintenance_due TEXT
    )
  `);

  // Routes
  db.exec(`
    CREATE TABLE IF NOT EXISTS routes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      distance_km REAL NOT NULL,
      duration_hours REAL NOT NULL,
      congestion_level TEXT DEFAULT 'low',
      fuel_cost REAL
    )
  `);

  // Shipments
  db.exec(`
    CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      origin_warehouse_id TEXT,
      destination TEXT NOT NULL,
      destination_lat REAL,
      destination_lng REAL,
      vehicle_id TEXT,
      route_id TEXT,
      status TEXT DEFAULT 'planned',
      priority TEXT DEFAULT 'normal',
      weight_kg REAL,
      cost REAL,
      created_at TEXT,
      dispatched_at TEXT,
      eta TEXT,
      delivered_at TEXT,
      delay_probability REAL,
      FOREIGN KEY (origin_warehouse_id) REFERENCES warehouses(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (route_id) REFERENCES routes(id)
    )
  `);

  // Orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      total_amount REAL,
      created_at TEXT,
      delivery_by TEXT
    )
  `);

  // Suppliers
  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT,
      lead_time_days INTEGER,
      reliability_score REAL
    )
  `);

  // Demand History
  db.exec(`
    CREATE TABLE IF NOT EXISTS demand_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      date TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Alerts
  db.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      entity_id TEXT,
      entity_type TEXT,
      created_at TEXT,
      resolved BOOLEAN DEFAULT 0
    )
  `);

  // AI Recommendations
  db.exec(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      priority TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      entity_id TEXT,
      estimated_savings REAL,
      estimated_time_savings REAL,
      action_payload TEXT,
      created_at TEXT,
      applied BOOLEAN DEFAULT 0,
      applied_at TEXT
    )
  `);

  console.log('✓ Database schema created');
}
