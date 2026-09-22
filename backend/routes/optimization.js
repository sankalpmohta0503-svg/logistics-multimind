import express from 'express';

export default function(db) {
  const router = express.Router();

  // Route optimization
  router.post('/route', (req, res) => {
    try {
      const { shipment_id, origin, destination } = req.body;

      // Get all possible routes
      const routes = db.prepare(`
        SELECT * FROM routes 
        WHERE origin LIKE ? AND destination LIKE ?
      `).all(`%${origin}%`, `%${destination}%`);

      if (routes.length === 0) {
        // Generate synthetic alternatives
        routes.push(
          { id: 'ROUTE-A', name: 'Route A (Current)', distance_km: 412, duration_hours: 8.67, fuel_cost: 28600, congestion_level: 'high' },
          { id: 'ROUTE-B', name: 'Route B (AI Recommended)', distance_km: 386, duration_hours: 6.92, fuel_cost: 21900, congestion_level: 'low' },
          { id: 'ROUTE-C', name: 'Route C (Alternative)', distance_km: 395, duration_hours: 7.5, fuel_cost: 24500, congestion_level: 'medium' }
        );
      }

      // Score routes
      const scoredRoutes = routes.map(route => {
        const distanceScore = 1 / route.distance_km;
        const timeScore = 1 / route.duration_hours;
        const costScore = 1 / route.fuel_cost;
        const congestionScore = route.congestion_level === 'low' ? 1 : route.congestion_level === 'medium' ? 0.6 : 0.3;
        
        const totalScore = (distanceScore * 0.25) + (timeScore * 0.3) + (costScore * 0.35) + (congestionScore * 0.1);
        
        return {
          ...route,
          score: totalScore,
          delay_risk: route.congestion_level === 'high' ? 31 : route.congestion_level === 'medium' ? 18 : 12
        };
      });

      scoredRoutes.sort((a, b) => b.score - a.score);

      const recommended = scoredRoutes[0];
      const current = scoredRoutes.find(r => r.name?.includes('Current')) || scoredRoutes[1];

      const comparison = {
        current: {
          route_id: current.id,
          name: current.name,
          distance_km: current.distance_km,
          duration_hours: current.duration_hours,
          fuel_cost: current.fuel_cost,
          delay_risk: current.delay_risk
        },
        recommended: {
          route_id: recommended.id,
          name: recommended.name,
          distance_km: recommended.distance_km,
          duration_hours: recommended.duration_hours,
          fuel_cost: recommended.fuel_cost,
          delay_risk: recommended.delay_risk
        },
        improvement: {
          distance_km: current.distance_km - recommended.distance_km,
          distance_pct: parseFloat((((current.distance_km - recommended.distance_km) / current.distance_km) * 100).toFixed(1)),
          duration_hours: parseFloat((current.duration_hours - recommended.duration_hours).toFixed(2)),
          duration_pct: parseFloat((((current.duration_hours - recommended.duration_hours) / current.duration_hours) * 100).toFixed(1)),
          cost_savings: current.fuel_cost - recommended.fuel_cost,
          cost_pct: parseFloat((((current.fuel_cost - recommended.fuel_cost) / current.fuel_cost) * 100).toFixed(1)),
          delay_risk_reduction: current.delay_risk - recommended.delay_risk
        },
        all_alternatives: scoredRoutes
      };

      res.json(comparison);
    } catch (error) {
      console.error('Route optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize route' });
    }
  });

  // Fleet allocation
  router.post('/fleet', (req, res) => {
    try {
      const { shipment_id, weight_kg, origin, destination } = req.body;

      // Get available vehicles
      const vehicles = db.prepare(`
        SELECT * FROM vehicles 
        WHERE status = 'available' AND capacity_kg >= ?
      `).all(weight_kg || 0);

      if (vehicles.length === 0) {
        return res.status(404).json({ error: 'No suitable vehicles available' });
      }

      // Score vehicles
      const scoredVehicles = vehicles.map(vehicle => {
        const capacityUtil = (weight_kg / vehicle.capacity_kg) * 100;
        const capacityScore = capacityUtil > 90 ? 0.5 : capacityUtil > 70 ? 1 : 0.8; // Prefer 70-90% utilization
        const fuelScore = vehicle.fuel_efficiency || 10;
        
        // Simulate distance (in real system, would calculate from origin)
        const simulatedDistance = 150 + Math.random() * 100;
        const distanceScore = 1 / simulatedDistance;
        
        const totalScore = (capacityScore * 0.4) + (fuelScore * 0.3) + (distanceScore * 0.3);
        
        const estimatedFuelCost = (simulatedDistance / vehicle.fuel_efficiency) * 120; // ₹120 per liter
        
        return {
          ...vehicle,
          score: totalScore,
          capacity_utilization: parseFloat(capacityUtil.toFixed(1)),
          estimated_distance: Math.round(simulatedDistance),
          estimated_fuel_cost: Math.round(estimatedFuelCost)
        };
      });

      scoredVehicles.sort((a, b) => b.score - a.score);

      const recommended = scoredVehicles[0];
      const alternatives = scoredVehicles.slice(1, 4);

      res.json({
        recommended,
        alternatives,
        reason: `Best combination of capacity utilization (${recommended.capacity_utilization}%), fuel efficiency, and proximity to origin.`,
        estimated_savings: alternatives.length > 0 
          ? Math.round(alternatives[0].estimated_fuel_cost - recommended.estimated_fuel_cost)
          : 0
      });
    } catch (error) {
      console.error('Fleet allocation error:', error);
      res.status(500).json({ error: 'Failed to allocate fleet' });
    }
  });

  // Multi-modal comparison
  router.post('/multimodal', (req, res) => {
    try {
      const { origin, destination, weight_kg, priority } = req.body;
      
      const distance = 450 + Math.random() * 200; // Simulated distance
      
      const modes = [
        {
          mode: 'road',
          cost: Math.round(distance * 55),
          duration_hours: distance / 65,
          risk: 'low',
          co2_emissions: Math.round(distance * 0.12),
          recommended: priority === 'standard'
        },
        {
          mode: 'rail',
          cost: Math.round(distance * 35),
          duration_hours: distance / 45,
          risk: 'medium',
          co2_emissions: Math.round(distance * 0.04),
          recommended: priority === 'economy'
        },
        {
          mode: 'air',
          cost: Math.round(distance * 135),
          duration_hours: distance / 550,
          risk: 'very_low',
          co2_emissions: Math.round(distance * 0.52),
          recommended: priority === 'urgent'
        }
      ];

      const recommended = modes.find(m => m.recommended) || modes[0];

      res.json({
        modes,
        recommended,
        reason: `Best ${priority || 'standard'} option for cost-time-risk balance`
      });
    } catch (error) {
      console.error('Multimodal comparison error:', error);
      res.status(500).json({ error: 'Failed to compare transport modes' });
    }
  });

  // Inventory optimization
  router.post('/inventory', (req, res) => {
    try {
      const { product_id, warehouse_id } = req.body;

      const inventory = db.prepare(`
        SELECT 
          i.*,
          p.sku,
          p.name,
          p.reorder_point,
          p.lead_time_days,
          w.name as warehouse_name
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        JOIN warehouses w ON i.warehouse_id = w.id
        WHERE i.product_id = ? AND i.warehouse_id = ?
      `).get(product_id, warehouse_id);

      if (!inventory) {
        return res.status(404).json({ error: 'Inventory not found' });
      }

      // Calculate demand
      const avgDemand = db.prepare(`
        SELECT AVG(quantity) as avg FROM demand_history 
        WHERE product_id = ? AND date > date('now', '-30 days')
      `).get(product_id).avg || 50;

      const daysRemaining = inventory.quantity / avgDemand;
      const safetyStock = avgDemand * 3; // 3 days safety stock
      const optimalReorder = Math.round((avgDemand * (inventory.lead_time_days + 7)) - inventory.quantity);

      const recommendation = {
        current_stock: inventory.quantity,
        reorder_point: inventory.reorder_point,
        avg_daily_demand: Math.round(avgDemand),
        days_remaining: parseFloat(daysRemaining.toFixed(1)),
        safety_stock: Math.round(safetyStock),
        recommended_reorder: Math.max(0, optimalReorder),
        action: optimalReorder > 0 ? 'reorder_now' : 'monitor',
        reason: daysRemaining < inventory.lead_time_days 
          ? 'Stock will run out before replenishment arrives'
          : 'Stock levels are adequate'
      };

      res.json(recommendation);
    } catch (error) {
      console.error('Inventory optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize inventory' });
    }
  });

  return router;
}
