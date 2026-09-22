import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const inventory = db.prepare(`
        SELECT 
          i.*,
          p.sku,
          p.name,
          p.category,
          p.unit_price,
          p.reorder_point,
          p.lead_time_days,
          w.name as warehouse_name,
          (i.quantity * p.unit_price) as value
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        ORDER BY value DESC
      `).all();

      res.json(inventory);
    } catch (error) {
      console.error('Inventory error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  router.get('/risks', (req, res) => {
    try {
      // Calculate inventory risks based on demand forecasting
      const risks = db.prepare(`
        SELECT 
          i.*,
          p.sku,
          p.name,
          p.category,
          p.reorder_point,
          p.lead_time_days,
          w.name as warehouse_name,
          (SELECT AVG(quantity) FROM demand_history WHERE product_id = p.id AND date > date('now', '-30 days')) as avg_daily_demand
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
      `).all();

      const analysedRisks = risks.map(item => {
        const avgDailyDemand = item.avg_daily_demand || 50;
        const daysRemaining = item.quantity / avgDailyDemand;
        const stockoutProbability = daysRemaining < item.lead_time_days 
          ? Math.min(95, Math.max(10, 100 - (daysRemaining / item.lead_time_days * 100)))
          : Math.max(5, 50 - daysRemaining * 2);

        let riskLevel = 'normal';
        if (item.quantity < item.reorder_point * 0.5) riskLevel = 'critical';
        else if (item.quantity < item.reorder_point) riskLevel = 'high';
        else if (item.quantity > item.reorder_point * 3) riskLevel = 'overstock';

        return {
          ...item,
          avg_daily_demand: Math.round(avgDailyDemand),
          days_remaining: parseFloat(daysRemaining.toFixed(1)),
          stockout_probability: parseFloat(stockoutProbability.toFixed(1)),
          risk_level: riskLevel,
          recommended_reorder: riskLevel === 'critical' || riskLevel === 'high' 
            ? Math.round(avgDailyDemand * (item.lead_time_days + 7))
            : null
        };
      });

      // Sort by risk level
      const riskOrder = { critical: 1, high: 2, overstock: 3, normal: 4 };
      analysedRisks.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);

      res.json(analysedRisks);
    } catch (error) {
      console.error('Inventory risks error:', error);
      res.status(500).json({ error: 'Failed to fetch inventory risks' });
    }
  });

  return router;
}
