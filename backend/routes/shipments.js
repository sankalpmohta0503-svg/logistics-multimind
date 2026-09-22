import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const { status, priority } = req.query;
      
      let query = `
        SELECT 
          s.*,
          w.name as origin_name,
          v.type as vehicle_type,
          r.name as route_name,
          r.distance_km,
          r.duration_hours
        FROM shipments s
        LEFT JOIN warehouses w ON s.origin_warehouse_id = w.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        LEFT JOIN routes r ON s.route_id = r.id
        WHERE 1=1
      `;
      
      const params = [];
      if (status) {
        query += ' AND s.status = ?';
        params.push(status);
      }
      if (priority) {
        query += ' AND s.priority = ?';
        params.push(priority);
      }
      
      query += ' ORDER BY s.created_at DESC';

      const shipments = db.prepare(query).all(...params);
      res.json(shipments);
    } catch (error) {
      console.error('Shipments error:', error);
      res.status(500).json({ error: 'Failed to fetch shipments' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const shipment = db.prepare(`
        SELECT 
          s.*,
          w.name as origin_name,
          w.lat as origin_lat,
          w.lng as origin_lng,
          v.type as vehicle_type,
          v.capacity_kg,
          v.driver_name,
          r.name as route_name,
          r.distance_km,
          r.duration_hours,
          r.congestion_level
        FROM shipments s
        LEFT JOIN warehouses w ON s.origin_warehouse_id = w.id
        LEFT JOIN vehicles v ON s.vehicle_id = v.id
        LEFT JOIN routes r ON s.route_id = r.id
        WHERE s.id = ?
      `).get(req.params.id);

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      // Calculate delay risk factors
      const riskFactors = calculateDelayRiskFactors(shipment);

      res.json({
        ...shipment,
        risk_factors: riskFactors
      });
    } catch (error) {
      console.error('Shipment detail error:', error);
      res.status(500).json({ error: 'Failed to fetch shipment details' });
    }
  });

  function calculateDelayRiskFactors(shipment) {
    const factors = [];

    // Route congestion
    if (shipment.congestion_level === 'high') {
      factors.push({ factor: 'Route congestion', contribution: 42, severity: 'high' });
    } else if (shipment.congestion_level === 'medium') {
      factors.push({ factor: 'Route congestion', contribution: 22, severity: 'medium' });
    }

    // Vehicle utilization
    if (shipment.weight_kg && shipment.capacity_kg) {
      const utilization = (shipment.weight_kg / shipment.capacity_kg) * 100;
      if (utilization > 90) {
        factors.push({ factor: 'Vehicle utilization', contribution: 28, severity: 'high' });
      } else if (utilization > 75) {
        factors.push({ factor: 'Vehicle utilization', contribution: 15, severity: 'medium' });
      }
    }

    // Delivery window
    if (shipment.eta) {
      const etaDate = new Date(shipment.eta);
      const now = new Date();
      const hoursUntilEta = (etaDate - now) / (1000 * 60 * 60);
      if (hoursUntilEta < 12) {
        factors.push({ factor: 'Delivery window', contribution: 18, severity: 'high' });
      }
    }

    // Historical pattern (simulated)
    if (shipment.delay_probability > 0.5) {
      factors.push({ factor: 'Historical pattern', contribution: 12, severity: 'medium' });
    }

    return factors;
  }

  return router;
}
