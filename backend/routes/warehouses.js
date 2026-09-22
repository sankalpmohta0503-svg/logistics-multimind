import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const warehouses = db.prepare(`
        SELECT 
          w.*,
          ROUND((w.occupied * 100.0 / w.capacity), 1) as utilization,
          (SELECT COUNT(*) FROM inventory WHERE warehouse_id = w.id) as sku_count,
          (SELECT SUM(i.quantity * p.unit_price) 
           FROM inventory i 
           JOIN products p ON i.product_id = p.id 
           WHERE i.warehouse_id = w.id) as inventory_value
        FROM warehouses w
        ORDER BY w.id
      `).all();

      res.json(warehouses);
    } catch (error) {
      console.error('Warehouses error:', error);
      res.status(500).json({ error: 'Failed to fetch warehouses' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const warehouse = db.prepare('SELECT * FROM warehouses WHERE id = ?').get(req.params.id);
      
      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found' });
      }

      // Get inventory for this warehouse
      const inventory = db.prepare(`
        SELECT 
          i.*,
          p.sku,
          p.name,
          p.category,
          p.unit_price,
          p.reorder_point,
          (i.quantity * p.unit_price) as value
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.warehouse_id = ?
        ORDER BY value DESC
      `).all(req.params.id);

      res.json({
        ...warehouse,
        inventory
      });
    } catch (error) {
      console.error('Warehouse detail error:', error);
      res.status(500).json({ error: 'Failed to fetch warehouse details' });
    }
  });

  return router;
}
