import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      // Total shipments
      const totalShipments = db.prepare('SELECT COUNT(*) as count FROM shipments').get().count;
      
      // On-time delivery
      const deliveredShipments = db.prepare(`
        SELECT COUNT(*) as total,
        SUM(CASE WHEN delivered_at <= eta THEN 1 ELSE 0 END) as onTime
        FROM shipments WHERE status = 'delivered'
      `).get();
      const onTimeDelivery = deliveredShipments.total > 0 
        ? (deliveredShipments.onTime / deliveredShipments.total) * 100 
        : 94.6;

      // Inventory health
      const inventoryHealth = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE 
            WHEN i.quantity > p.reorder_point * 1.5 THEN 1
            WHEN i.quantity < p.reorder_point THEN 0
            ELSE 1
          END) as healthy
        FROM inventory i
        JOIN products p ON i.product_id = p.id
      `).get();
      const inventoryHealthPct = inventoryHealth.total > 0
        ? (inventoryHealth.healthy / inventoryHealth.total) * 100
        : 91;

      // Fleet utilization
      const fleetUtil = db.prepare(`
        SELECT AVG(current_load_kg / capacity_kg) * 100 as avgUtil
        FROM vehicles WHERE status = 'in_transit'
      `).get();
      const fleetUtilization = fleetUtil.avgUtil || 78;

      // Logistics cost
      const costData = db.prepare(`
        SELECT SUM(cost) as total FROM shipments 
        WHERE created_at > date('now', '-30 days')
      `).get();
      const logisticsCost = costData.total || 1840000;

      // At-risk shipments
      const atRiskShipments = db.prepare(`
        SELECT COUNT(*) as count FROM shipments 
        WHERE status IN ('dispatched', 'in_transit') AND delay_probability > 0.5
      `).get().count;

      // Stockout risks
      const stockoutRisks = db.prepare(`
        SELECT COUNT(*) as count FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.quantity < p.reorder_point
      `).get().count;

      // Calculate supply chain health score
      const healthScore = Math.round(
        (onTimeDelivery * 0.3) + 
        (inventoryHealthPct * 0.25) + 
        (fleetUtilization * 0.2) + 
        (100 - (atRiskShipments * 2)) * 0.15 +
        (100 - (stockoutRisks * 3)) * 0.1
      );

      // Get recent alerts
      const alerts = db.prepare(`
        SELECT * FROM alerts 
        WHERE resolved = 0 
        ORDER BY 
          CASE severity 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            ELSE 4 
          END,
          created_at DESC 
        LIMIT 10
      `).all();

      // Get top recommendations
      const recommendations = db.prepare(`
        SELECT * FROM recommendations 
        WHERE applied = 0 
        ORDER BY 
          CASE priority 
            WHEN 'critical' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'medium' THEN 3 
            ELSE 4 
          END,
          estimated_savings DESC
        LIMIT 5
      `).all();

      // Calculate projected savings
      const projectedSavings = db.prepare(`
        SELECT SUM(estimated_savings) as total FROM recommendations WHERE applied = 0
      `).get().total || 320000;

      res.json({
        kpis: {
          totalShipments,
          onTimeDelivery: parseFloat(onTimeDelivery.toFixed(1)),
          inventoryHealth: parseFloat(inventoryHealthPct.toFixed(1)),
          fleetUtilization: parseFloat(fleetUtilization.toFixed(1)),
          logisticsCost,
          projectedSavings,
          atRiskShipments,
          stockoutRisks
        },
        healthScore,
        healthStatus: healthScore >= 85 ? 'healthy' : healthScore >= 70 ? 'warning' : 'critical',
        alerts,
        recommendations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  return router;
}
