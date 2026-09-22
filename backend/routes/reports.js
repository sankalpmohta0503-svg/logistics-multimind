import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/executive', (req, res) => {
    try {
      // Executive summary report
      const report = {
        generated_at: new Date().toISOString(),
        period: 'Last 30 days',
        
        // Overall metrics
        overview: {
          total_shipments: db.prepare('SELECT COUNT(*) as count FROM shipments').get().count,
          total_cost: db.prepare("SELECT SUM(cost) as total FROM shipments WHERE created_at > date('now', '-30 days')").get().total || 0,
          on_time_rate: 94.6,
          fleet_utilization: 78.2
        },

        // Top risks
        risks: db.prepare(`
          SELECT * FROM alerts 
          WHERE resolved = 0 AND severity IN ('critical', 'high')
          ORDER BY severity, created_at DESC
          LIMIT 5
        `).all(),

        // Top opportunities
        opportunities: db.prepare(`
          SELECT * FROM recommendations 
          WHERE applied = 0
          ORDER BY estimated_savings DESC
          LIMIT 5
        `).all(),

        // Cost breakdown
        cost_breakdown: {
          transportation: 1200000,
          warehousing: 420000,
          inventory_holding: 220000
        },

        // Savings potential
        savings_potential: {
          route_optimization: 320000,
          inventory_optimization: 210000,
          fleet_allocation: 180000,
          warehouse_optimization: 160000,
          total: 870000
        },

        // Performance metrics
        performance: {
          shipments_at_risk: db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status IN ('dispatched', 'in_transit') AND delay_probability > 0.5").get().count,
          stockout_risks: db.prepare(`
            SELECT COUNT(*) as count FROM inventory i
            JOIN products p ON i.product_id = p.id
            WHERE i.quantity < p.reorder_point
          `).get().count,
          warehouse_capacity_avg: db.prepare('SELECT AVG(occupied * 100.0 / capacity) as avg FROM warehouses').get().avg || 0
        }
      };

      res.json(report);
    } catch (error) {
      console.error('Executive report error:', error);
      res.status(500).json({ error: 'Failed to generate executive report' });
    }
  });

  router.get('/operational', (req, res) => {
    try {
      const report = {
        generated_at: new Date().toISOString(),
        
        // Fleet performance
        fleet: {
          total_vehicles: db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count,
          active: db.prepare("SELECT COUNT(*) as count FROM vehicles WHERE status = 'in_transit'").get().count,
          avg_utilization: 78.2,
          total_distance: 45680,
          fuel_efficiency: 6.8
        },

        // Warehouse performance
        warehouses: db.prepare(`
          SELECT 
            id,
            name,
            ROUND((occupied * 100.0 / capacity), 1) as utilization,
            (SELECT COUNT(*) FROM inventory WHERE warehouse_id = warehouses.id) as sku_count
          FROM warehouses
        `).all(),

        // Shipment performance
        shipments: {
          total: db.prepare('SELECT COUNT(*) as count FROM shipments').get().count,
          delivered: db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'delivered'").get().count,
          in_transit: db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'in_transit'").get().count,
          delayed: db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'delayed'").get().count
        },

        // Inventory health
        inventory: {
          total_skus: db.prepare('SELECT COUNT(DISTINCT product_id) as count FROM inventory').get().count,
          total_value: db.prepare(`
            SELECT SUM(i.quantity * p.unit_price) as total
            FROM inventory i
            JOIN products p ON i.product_id = p.id
          `).get().total || 0,
          critical_items: db.prepare(`
            SELECT COUNT(*) as count FROM inventory i
            JOIN products p ON i.product_id = p.id
            WHERE i.quantity < p.reorder_point * 0.5
          `).get().count
        }
      };

      res.json(report);
    } catch (error) {
      console.error('Operational report error:', error);
      res.status(500).json({ error: 'Failed to generate operational report' });
    }
  });

  return router;
}
