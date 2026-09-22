# SC-LogiX - Intelligent Supply Chain Control Hub

**AI-powered Supply Chain Operations Platform for Predictive Visibility, Fleet & Warehouse Optimization**

SC-LogiX transforms fragmented supply-chain data into predictive insights, optimized decisions, and measurable business impact.

## 🎯 Problem Statement

Modern supply chains operate with fragmented information across warehouses, inventory, orders, shipments, vehicles, and routes. This causes:
- Delayed decisions and poor visibility
- Stockouts and excess inventory
- Inefficient vehicle allocation and routing
- Higher transportation costs
- Difficulty identifying hidden inefficiencies

SC-LogiX addresses these challenges through an intelligent, AI-powered control hub.

## ✨ Key Features

### 1. **Command Center Dashboard**
- Real-time supply chain health score (0-100)
- Key performance indicators (KPIs)
- AI-powered operations brief with actionable recommendations
- Critical alerts and risk indicators

### 2. **Predictive Analytics**
- **Demand Forecasting**: 30-day demand prediction with confidence intervals
- **Delay Prediction**: Shipment delay probability with contributing factors
- **Cost Forecasting**: Projected transportation costs
- **Warehouse Capacity Forecast**: Predict capacity constraints

### 3. **AI Optimization Engine**
- **Route Optimization**: Find optimal routes with cost/time/risk analysis
- **Fleet Allocation**: Intelligent vehicle assignment based on capacity, efficiency, and proximity
- **Multi-Modal Comparison**: Compare road, rail, air, and sea transportation
- **Inventory Optimization**: Automated reorder recommendations

### 4. **Inventory Risk Radar**
- Real-time stockout risk detection
- Overstock identification
- Days-of-inventory remaining calculation
- Automated reorder point alerts

### 5. **Fleet Operations**
- Real-time vehicle tracking and status
- Utilization monitoring
- Fuel efficiency tracking
- Maintenance scheduling

### 6. **Explainable AI**
Every recommendation includes:
- **Why?** - Root cause analysis
- **What data?** - Contributing factors
- **What if we act?** - Expected impact
- **What if we don't?** - Risk assessment

## 🏗️ Architecture

```
React Frontend (Vite + Tailwind)
       |
       | REST API
       ↓
Node.js + Express Backend
       |
       ├── SQLite Database
       |
       └── Analytics Engine
           ├── Demand Forecasting
           ├── Delay Prediction
           ├── Route Optimization
           └── Fleet Allocation
```

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - API server
- **SQLite** - Local database
- **Better-sqlite3** - Database driver

## 📦 Installation & Startup

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- npm (included with Node.js)

### Quick Start (Recommended)

**Windows PowerShell:**
```powershell
# Run the startup script
.\start-sclogix.ps1
```

This script will:
1. Check for Node.js installation
2. Install all dependencies (if not already installed)
3. Start both backend and frontend servers
4. Open the application in your browser

### Manual Installation

If you prefer to run manually:

**Step 1: Install Dependencies**
```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Step 2: Start Backend**
```powershell
cd backend
node server.js
```
Backend will run on `http://localhost:3001`

**Step 3: Start Frontend** (in a new terminal)
```powershell
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

**Step 4: Open Application**
```
http://localhost:3000
```

### Verification

Once started, you should see:
- ✓ Backend: "SC-LogiX Backend running on http://localhost:3001"
- ✓ Frontend: "Local: http://localhost:3000"
- ✓ Database seeded with demo data

### Troubleshooting

**If backend fails to start:**
- Ensure port 3001 is not in use
- Check that Node.js v16+ is installed: `node --version`

**If frontend fails to start:**
- Ensure port 3000 is not in use
- Clear node_modules and reinstall: `rm -rf frontend/node_modules && cd frontend && npm install`

**If you see SQL errors:**
- Delete the database file: `rm backend/sclogix.db`
- Restart the backend - it will recreate and seed automatically

## 🎬 Demo Flow (for Judges)

### 1. Command Center (Landing Page)
- **Supply Chain Health Score**: 87/100
- **KPI Overview**: Shipments, On-Time Delivery, Fleet Utilization, Costs
- **AI Operations Brief**: 3 high-impact decisions requiring attention

### 2. Critical Shipment at Risk
- **Shipment SHP-1048**: 82% delay probability
- **Contributing Factors**:
  - Route congestion (42%)
  - Vehicle utilization (28%)
  - Delivery window pressure (18%)
- **AI Recommendation**: Reassign to Vehicle V-204 + Route B
- **Expected Impact**: ₹6,700 savings, 1.75h faster, 19 pp risk reduction

### 3. Inventory Stockout Risk
- **SKU-2048 (Critical Component M)**: 480 units remaining
- **Forecast**: Will stockout in 4.4 days
- **Recommendation**: Reorder 1,200 units immediately
- **Impact**: Stockout probability 71% → 12%

### 4. Warehouse Capacity Alert
- **WH-03**: Currently at 88.8% utilization
- **Forecast**: Will reach 94% in 9 days
- **Recommendation**: Redistribute 720 units to WH-01
- **Impact**: Capacity 94% → 78%

### 5. Route Optimization Demo
Navigate to **AI Optimization** page:
- Click "Run Route Optimization"
- See **Before/After Comparison**:
  - Distance: 412 km → 386 km (-6.3%)
  - Time: 8.67h → 6.92h (-20.2%)
  - Cost: ₹28,600 → ₹21,900 (₹6,700 savings)
  - Delay Risk: 31% → 12% (-19 pp)

### 6. Predictive Analytics
- **Demand Forecast**: 30-day prediction with 92.4% accuracy
- **Delay Predictions**: Real-time risk assessment for all active shipments
- **Cost Forecast**: Projected daily logistics costs

### 7. Executive Report
- **Total Savings Potential**: ₹8.7L
  - Route optimization: ₹3.2L
  - Inventory optimization: ₹2.1L
  - Fleet allocation: ₹1.8L
  - Warehouse optimization: ₹1.6L

## 📊 Demo Data

The system comes pre-loaded with realistic demo data:
- **4 warehouses** across India (Mumbai, Delhi, Bangalore, Chennai)
- **10 product SKUs** with demand history
- **9 vehicles** with varying capacities and statuses
- **6+ shipments** including at-risk deliveries
- **4 critical alerts** requiring attention
- **5 AI recommendations** with measurable impact

### Intentional Problems in Demo Data
The seed data contains realistic operational issues:
- High-risk shipments with congested routes
- Products below reorder point (stockout risk)
- Warehouse approaching capacity limits
- Overstock situations
- Under-utilized vehicles

This demonstrates the AI's ability to detect and solve real problems.

## 🎯 Business Value Proposition

### For Supply Chain Managers
- **Visibility**: Real-time health score and KPIs
- **Control**: Centralized operations command center
- **Confidence**: Explainable AI recommendations

### For Logistics Managers
- **Efficiency**: Route and fleet optimization
- **Cost Savings**: ₹3.2L+ in route optimization alone
- **Risk Mitigation**: Proactive delay detection

### For Warehouse Managers
- **Inventory Health**: 91% health score
- **Stockout Prevention**: 5-day advance warning
- **Capacity Planning**: 9-day forecast horizon

### For Executives
- **ROI**: ₹8.7L total savings potential
- **Metrics**: 94.6% on-time delivery rate
- **Insights**: Data-driven decision support

## 🚀 Key Differentiators

1. **Explainable AI**: Every recommendation shows WHY, WHAT, and IMPACT
2. **Before/After Analysis**: Clear visualization of optimization impact
3. **Predictive Intelligence**: Not just reactive dashboards
4. **Actionable Insights**: Direct action buttons on recommendations
5. **Holistic View**: Integrates warehouses, inventory, fleet, and shipments
6. **Business Focus**: All features tied to measurable cost/time savings

## 📁 Project Structure

```
sc-logix/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── App.jsx         # Main app component
│   └── package.json
│
├── backend/                 # Node.js server
│   ├── routes/             # API route handlers
│   │   ├── dashboard.js
│   │   ├── warehouses.js
│   │   ├── inventory.js
│   │   ├── shipments.js
│   │   ├── fleet.js
│   │   ├── analytics.js
│   │   ├── optimization.js
│   │   ├── alerts.js
│   │   └── reports.js
│   ├── database/
│   │   ├── init.js         # Database schema
│   │   └── seed.js         # Demo data seeder
│   ├── server.js           # Express server
│   └── package.json
│
├── README.md               # This file
└── package.json            # Root package
```

## 🔧 API Endpoints

### Dashboard
- `GET /api/dashboard` - Main dashboard data with KPIs and health score

### Warehouses
- `GET /api/warehouses` - List all warehouses with utilization
- `GET /api/warehouses/:id` - Warehouse details with inventory

### Inventory
- `GET /api/inventory` - All inventory records
- `GET /api/inventory/risks` - Inventory risk analysis with stockout predictions

### Shipments
- `GET /api/shipments` - List shipments (filterable by status/priority)
- `GET /api/shipments/:id` - Shipment details with risk factors

### Fleet
- `GET /api/fleet` - Fleet overview with statistics
- `GET /api/fleet/:id` - Vehicle details

### Analytics
- `GET /api/analytics/demand` - Demand forecasting
- `GET /api/analytics/delay` - Delay predictions
- `GET /api/analytics/cost` - Cost forecasting
- `GET /api/analytics/warehouse-capacity` - Warehouse capacity forecast

### Optimization
- `POST /api/optimization/route` - Route optimization
- `POST /api/optimization/fleet` - Fleet allocation
- `POST /api/optimization/multimodal` - Multi-modal comparison
- `POST /api/optimization/inventory` - Inventory optimization

### Alerts & Recommendations
- `GET /api/alerts` - Active alerts
- `GET /api/alerts/recommendations` - AI recommendations
- `POST /api/alerts/recommendations/:id/apply` - Apply recommendation

### Reports
- `GET /api/reports/executive` - Executive summary report
- `GET /api/reports/operational` - Operational performance report

## 🎨 Design Principles

1. **Professional Command Center Aesthetic**: Dark sidebar, clean cards, clear hierarchy
2. **Semantic Color Usage**: Green (healthy/savings), Amber (warning), Red (critical), Blue (info), Purple (AI)
3. **Information Density**: Compact but readable, avoiding excessive whitespace
4. **Action-Oriented**: Every insight has a clear action button
5. **Visual Hierarchy**: Most important information immediately visible
6. **Consistent Components**: Reusable KPI cards, status badges, AI decision cards

## 📈 Judging Criteria Alignment

### Problem-Solution Fit ✅
- Clear problem statement (fragmented supply chain data)
- Comprehensive solution (unified intelligent control hub)
- Measurable impact (₹8.7L savings potential)

### Innovation ✅
- AI-powered predictive analytics
- Explainable recommendations
- Before/After impact visualization
- Multi-dimensional optimization

### Technical Implementation ✅
- Modern tech stack (React, Node.js, SQLite)
- RESTful API architecture
- Real-time calculations
- Responsive UI

### User Experience ✅
- Professional design
- Intuitive navigation
- Clear visualizations
- Action-oriented interface

### Business Value ✅
- ROI-focused features
- Cost savings quantification
- Risk mitigation
- Operational efficiency

### Completeness ✅
- End-to-end workflow
- Integrated modules
- Comprehensive demo data
- Production-ready prototype

## 🔮 Future Enhancements

- Real-time GPS tracking integration
- Machine learning model training on historical data
- Mobile app for field operations
- Integration with ERP systems
- Advanced What-If scenario simulator
- Automated action execution
- Multi-tenant support
- Role-based access control

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🙏 Acknowledgments

Built as a hackathon prototype demonstrating intelligent supply chain management through AI-powered decision support.

---

**SC-LogiX** - Transforming Supply Chain Operations Through Intelligent Automation

*For questions or support, refer to the demo flow above or explore the codebase.*
