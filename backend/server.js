import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
let db;
let SQL_DB; // Store the original sql.js database
const dbPath = join(__dirname, 'sclogix.db');

// Initialize SQL.js and database
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    SQL_DB = new SQL.Database(buffer);
    console.log('✓ Loaded existing database');
  } else {
    SQL_DB = new SQL.Database();
    console.log('✓ Created new database');
  }
  
  // Wrapper to match better-sqlite3 API
  db = {
    exec: (sql) => {
      SQL_DB.run(sql);
    },
    
    prepare: (sql) => {
      return {
        run: (...params) => {
          try {
            const stmt = SQL_DB.prepare(sql);
            if (params.length > 0) {
              stmt.bind(params);
            }
            stmt.step();
            stmt.free();
          } catch (e) {
            console.error('SQL run error:', e.message);
            throw e;
          }
        },
        get: (...params) => {
          try {
            const stmt = SQL_DB.prepare(sql);
            if (params.length > 0) {
              stmt.bind(params);
            }
            if (stmt.step()) {
              const row = stmt.getAsObject();
              stmt.free();
              return row;
            }
            stmt.free();
            return undefined;
          } catch (e) {
            console.error('SQL get error:', e.message);
            throw e;
          }
        },
        all: (...params) => {
          try {
            const stmt = SQL_DB.prepare(sql);
            if (params.length > 0) {
              stmt.bind(params);
            }
            const results = [];
            while (stmt.step()) {
              results.push(stmt.getAsObject());
            }
            stmt.free();
            return results;
          } catch (e) {
            console.error('SQL all error:', e.message);
            throw e;
          }
        }
      };
    }
  };
  
  // Save database periodically
  setInterval(() => {
    const data = SQL_DB.export();
    writeFileSync(dbPath, data);
  }, 10000);
  
  // Initialize schema and seed data
  const [initModule, seedModule] = await Promise.all([
    import('./database/init.js'),
    import('./database/seed.js')
  ]);
  
  initModule.initDatabase(db);
  seedModule.seedDatabase(db);
  
  // Save immediately after seeding
  const data = SQL_DB.export();
  writeFileSync(dbPath, data);
  
  console.log('✓ Database ready');
}

await initDatabase();

// Routes
import('./routes/dashboard.js').then(module => {
  app.use('/api/dashboard', module.default(db));
});

import('./routes/warehouses.js').then(module => {
  app.use('/api/warehouses', module.default(db));
});

import('./routes/inventory.js').then(module => {
  app.use('/api/inventory', module.default(db));
});

import('./routes/shipments.js').then(module => {
  app.use('/api/shipments', module.default(db));
});

import('./routes/fleet.js').then(module => {
  app.use('/api/fleet', module.default(db));
});

import('./routes/analytics.js').then(module => {
  app.use('/api/analytics', module.default(db));
});

import('./routes/optimization.js').then(module => {
  app.use('/api/optimization', module.default(db));
});

import('./routes/alerts.js').then(module => {
  app.use('/api/alerts', module.default(db));
});

import('./routes/reports.js').then(module => {
  app.use('/api/reports', module.default(db));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SC-LogiX Backend running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api\n`);
});
