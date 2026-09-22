import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const vehicles = db.prepare(`
        SELECT 
          v.*,
          ROUND((v.current_load_kg * 100.0 / v.capacity_kg), 1) as utilization,
          (SELECT COUNT(*) FROM shipments WHERE vehicle_id = v.id AND status IN ('dispatched', 'in_transit')) as active_shipments
        FROM vehicles v
        ORDER BY v.id
      `).all();

      // Calculate fleet statistics
      const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'in_transit').length,
        idle: vehicles.filter(v => v.status === 'available').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        avgUtilization: vehicles.filter(v => v.status === 'in_transit')
          .reduce((sum, v) => sum + (v.current_load_kg / v.capacity_kg), 0) / 
          Math.max(1, vehicles.filter(v => v.status === 'in_transit').length) * 100,
        avgFuelEfficiency: vehicles.reduce((sum, v) => sum + (v.fuel_efficiency || 0), 0) / vehicles.length
      };

      res.json({
        vehicles,
        stats: {
          ...stats,
          avgUtilization: parseFloat(stats.avgUtilization.toFixed(1)),
          avgFuelEfficiency: parseFloat(stats.avgFuelEfficiency.toFixed(1))
        }
      });
    } catch (error) {
      console.error('Fleet error:', error);
      res.status(500).json({ error: 'Failed to fetch fleet data' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      // Get shipments for this vehicle
      const shipments = db.prepare(`
        SELECT 
          s.*,
          w.name as origin_name,
          r.name as route_name
        FROM shipments s
        LEFT JOIN warehouses w ON s.origin_warehouse_id = w.id
        LEFT JOIN routes r ON s.route_id = r.id
        WHERE s.vehicle_id = ?
        ORDER BY s.created_at DESC
        LIMIT 10
      `).all(req.params.id);

      res.json({
        ...vehicle,
        shipments
      });
    } catch (error) {
      console.error('Vehicle detail error:', error);
      res.status(500).json({ error: 'Failed to fetch vehicle details' });
    }
  });

  return router;
}
