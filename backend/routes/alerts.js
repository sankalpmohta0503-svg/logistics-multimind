import express from 'express';

export default function(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      const { severity, resolved } = req.query;
      
      let query = 'SELECT * FROM alerts WHERE 1=1';
      const params = [];
      
      if (severity) {
        query += ' AND severity = ?';
        params.push(severity);
      }
      
      if (resolved !== undefined) {
        query += ' AND resolved = ?';
        params.push(resolved === 'true' ? 1 : 0);
      }
      
      query += ` ORDER BY 
        CASE severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        created_at DESC`;

      const alerts = db.prepare(query).all(...params);
      res.json(alerts);
    } catch (error) {
      console.error('Alerts error:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  router.patch('/:id/resolve', (req, res) => {
    try {
      db.prepare('UPDATE alerts SET resolved = 1 WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Alert resolve error:', error);
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  // Get recommendations (AI actions)
  router.get('/recommendations', (req, res) => {
    try {
      const { include_applied, status } = req.query;
      let query = 'SELECT * FROM recommendations';
      
      if (include_applied !== 'true' && status !== 'all') {
        query += ' WHERE applied = 0';
      }
      
      query += ` ORDER BY 
        CASE priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        estimated_savings DESC`;

      let recommendations = db.prepare(query).all();

      // If no pending recommendations found and no strict filter, return all so UI can display applied status
      if (recommendations.length === 0 && include_applied !== 'false' && status !== 'pending') {
        recommendations = db.prepare(`
          SELECT * FROM recommendations 
          ORDER BY 
            CASE priority 
              WHEN 'critical' THEN 1 
              WHEN 'high' THEN 2 
              WHEN 'medium' THEN 3 
              ELSE 4 
            END,
            estimated_savings DESC
        `).all();
      }

      res.json(recommendations);
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  });

  router.post('/recommendations/:id/apply', (req, res) => {
    try {
      const recommendation = db.prepare('SELECT * FROM recommendations WHERE id = ?').get(req.params.id);
      
      if (!recommendation) {
        return res.status(404).json({ error: 'Recommendation not found' });
      }

      // Mark as applied
      db.prepare(`
        UPDATE recommendations 
        SET applied = 1, applied_at = datetime('now') 
        WHERE id = ?
      `).run(req.params.id);

      res.json({ 
        success: true, 
        message: 'Recommendation applied successfully',
        savings: recommendation.estimated_savings
      });
    } catch (error) {
      console.error('Apply recommendation error:', error);
      res.status(500).json({ error: 'Failed to apply recommendation' });
    }
  });

  // Reset alerts & recommendations for demo walkthroughs
  router.post('/reset', (req, res) => {
    try {
      db.prepare('UPDATE recommendations SET applied = 0, applied_at = NULL').run();
      db.prepare('UPDATE alerts SET resolved = 0').run();
      res.json({ success: true, message: 'All alerts and recommendations have been reset to active state' });
    } catch (error) {
      console.error('Reset error:', error);
      res.status(500).json({ error: 'Failed to reset alerts and recommendations' });
    }
  });

  return router;
}
