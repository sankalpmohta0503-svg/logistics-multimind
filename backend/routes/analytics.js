import express from 'express';

export default function(db) {
  const router = express.Router();

  // Demand forecasting
  router.get('/demand', (req, res) => {
    try {
      const { product_id, days = 30 } = req.query;

      const products = product_id 
        ? [db.prepare('SELECT * FROM products WHERE id = ?').get(product_id)]
        : db.prepare('SELECT * FROM products LIMIT 10').all();

      const forecasts = products.map(product => {
        // Get historical demand
        const history = db.prepare(`
          SELECT date, quantity 
          FROM demand_history 
          WHERE product_id = ? 
          ORDER BY date DESC 
          LIMIT 90
        `).all(product.id);

        // Simple moving average forecast
        const avgDemand = history.length > 0
          ? history.reduce((sum, h) => sum + h.quantity, 0) / history.length
          : 50;

        // Generate forecast
        const forecast = [];
        const today = new Date();
        for (let i = 1; i <= parseInt(days); i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          
          // Add some variation
          const variation = (Math.random() - 0.5) * 0.3;
          const predictedDemand = Math.round(avgDemand * (1 + variation));
          
          forecast.push({
            date: date.toISOString().split('T')[0],
            predicted: predictedDemand,
            lower_bound: Math.round(predictedDemand * 0.85),
            upper_bound: Math.round(predictedDemand * 1.15)
          });
        }

        return {
          product_id: product.id,
          sku: product.sku,
          name: product.name,
          historical_avg: Math.round(avgDemand),
          forecast,
          accuracy: 92.4 // Model accuracy (demo value)
        };
      });

      res.json(forecasts);
    } catch (error) {
      console.error('Demand forecast error:', error);
      res.status(500).json({ error: 'Failed to generate demand forecast' });
    }
  });

  // Delay prediction
  router.get('/delay', (req, res) => {
    try {
      const shipments = db.prepare(`
        SELECT 
          s.*,
          r.congestion_level,
          r.distance_km,
          v.capacity_kg
        FROM shipments s
        LEFT JOIN routes r ON s.route_id = r.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        WHERE s.status IN ('dispatched', 'in_transit')
      `).all();

      const predictions = shipments.map(s => {
        let delayProb = s.delay_probability || 0;
        
        // Recalculate if not set
        if (!delayProb) {
          delayProb = 10; // base probability
          
          if (s.congestion_level === 'high') delayProb += 40;
          else if (s.congestion_level === 'medium') delayProb += 20;
          
          if (s.weight_kg && s.capacity_kg) {
            const util = (s.weight_kg / s.capacity_kg) * 100;
            if (util > 90) delayProb += 25;
            else if (util > 75) delayProb += 12;
          }
          
          if (s.distance_km > 400) delayProb += 15;
          
          delayProb = Math.min(95, delayProb);
        }

        return {
          shipment_id: s.id,
          destination: s.destination,
          delay_probability: parseFloat(delayProb.toFixed(1)),
          risk_level: delayProb > 70 ? 'high' : delayProb > 40 ? 'medium' : 'low',
          eta: s.eta,
          current_status: s.status
        };
      });

      predictions.sort((a, b) => b.delay_probability - a.delay_probability);

      res.json(predictions);
    } catch (error) {
      console.error('Delay prediction error:', error);
      res.status(500).json({ error: 'Failed to predict delays' });
    }
  });

  // Cost forecasting
  router.get('/cost', (req, res) => {
    try {
      const { days = 30 } = req.query;

      // Get historical costs
      const historicalCosts = db.prepare(`
        SELECT 
          date(created_at) as date,
          SUM(cost) as total_cost
        FROM shipments
        WHERE created_at > date('now', '-90 days')
        GROUP BY date(created_at)
        ORDER BY date DESC
      `).all();

      const avgDailyCost = historicalCosts.length > 0
        ? historicalCosts.reduce((sum, h) => sum + h.total_cost, 0) / historicalCosts.length
        : 60000;

      // Generate forecast
      const forecast = [];
      const today = new Date();
      for (let i = 1; i <= parseInt(days); i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const variation = (Math.random() - 0.5) * 0.2;
        const predictedCost = Math.round(avgDailyCost * (1 + variation));
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          predicted_cost: predictedCost,
          lower_bound: Math.round(predictedCost * 0.9),
          upper_bound: Math.round(predictedCost * 1.1)
        });
      }

      res.json({
        historical_avg_daily: Math.round(avgDailyCost),
        forecast,
        total_forecast: forecast.reduce((sum, f) => sum + f.predicted_cost, 0)
      });
    } catch (error) {
      console.error('Cost forecast error:', error);
      res.status(500).json({ error: 'Failed to forecast costs' });
    }
  });

  // Warehouse capacity forecast
  router.get('/warehouse-capacity', (req, res) => {
    try {
      const warehouses = db.prepare(`
        SELECT 
          w.*,
          ROUND((w.occupied * 100.0 / w.capacity), 1) as current_utilization,
          (SELECT COUNT(*) FROM shipments WHERE origin_warehouse_id = w.id AND status = 'planned') as outbound_count,
          (SELECT SUM(weight_kg) FROM shipments WHERE destination LIKE '%' || w.name || '%' AND status IN ('dispatched', 'in_transit')) as inbound_weight
        FROM warehouses w
      `).all();

      const forecasts = warehouses.map(wh => {
        const avgDailyChange = (Math.random() - 0.4) * 100; // Slightly negative bias
        const forecast = [];
        
        let currentOccupied = wh.occupied;
        const today = new Date();
        
        for (let i = 1; i <= 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          
          currentOccupied += avgDailyChange;
          currentOccupied = Math.max(0, Math.min(wh.capacity, currentOccupied));
          
          forecast.push({
            date: date.toISOString().split('T')[0],
            predicted_occupied: Math.round(currentOccupied),
            predicted_utilization: parseFloat(((currentOccupied / wh.capacity) * 100).toFixed(1))
          });
        }

        const futureUtilization = forecast[forecast.length - 1].predicted_utilization;
        
        return {
          warehouse_id: wh.id,
          warehouse_name: wh.name,
          current_utilization: wh.current_utilization,
          forecast,
          risk_level: futureUtilization > 90 ? 'high' : futureUtilization > 75 ? 'medium' : 'low'
        };
      });

      res.json(forecasts);
    } catch (error) {
      console.error('Warehouse capacity forecast error:', error);
      res.status(500).json({ error: 'Failed to forecast warehouse capacity' });
    }
  });

  return router;
}
