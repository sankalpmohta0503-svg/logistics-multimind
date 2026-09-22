# SC-LogiX - Quick Start Guide

## 🚀 Start in 30 Seconds

### Option 1: Automatic Startup (Recommended)
```powershell
.\start-sclogix.ps1
```
This will:
- Check dependencies
- Start backend (port 3001)
- Start frontend (port 3000)
- Open browser automatically

### Option 2: Manual Start
```powershell
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## ✅ You'll Know It's Working When You See:

### Backend Terminal:
```
✓ Created new database
✓ Database schema created
🌱 Seeding database...
✓ Database seeded successfully
  - 5 suppliers
  - 4 warehouses
  - 10 products
  - 13 inventory records
  - 9 vehicles
  - 6 routes
  - 6 shipments
  - 4 alerts
  - 5 AI recommendations
✓ Database ready
🚀 SC-LogiX Backend running on http://localhost:3001
📊 API available at http://localhost:3001/api
```

### Frontend Terminal:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Browser (http://localhost:3000):
- Command Center dashboard loads
- Health Score shows 72/100
- KPIs display: 6 shipments, 2 at risk
- AI Operations Brief shows recommendations

---

## 🎬 Demo Flow (5 Minutes)

### 1. **Command Center** (30 seconds)
Point out:
- Health Score: 72/100 (warning state)
- 2 at-risk shipments
- ₹1.3L projected savings

### 2. **AI Intelligence** (90 seconds)
Show:
- Shipment SHP-1048: 82% delay probability
- Why it's at risk (route congestion 42%, etc.)
- Recommendation: ₹6,700 savings, 1.75h faster

### 3. **Route Optimization Demo** (90 seconds)
Navigate to: **AI Optimization**
- Click "Run Route Optimization"
- Show before/after: ₹28,600 → ₹21,900
- Highlight 23.4% cost reduction

### 4. **Inventory Risk** (60 seconds)
Navigate to: **Inventory**
- Show 4 items at risk
- Point out SKU-2048: 4.4 days remaining
- Stockout probability: 78%

### 5. **Executive Value** (60 seconds)
Navigate to: **Reports**
- Total opportunity: ₹8.7L
- Breakdown by category
- Performance metrics

---

## 💡 Quick Demo Tips

1. **Start with impact**: "72/100 health score, ₹1.3L savings identified"
2. **Show intelligence**: Click on SHP-1048 recommendation
3. **Demonstrate optimization**: Run route optimizer live
4. **End with value**: Reports page shows ₹8.7L total

---

## 🔧 Troubleshooting

### Backend won't start?
- Check port 3001 is free: `Get-NetTCPConnection -LocalPort 3001`
- Delete database: `Remove-Item backend/sclogix.db`
- Restart

### Frontend won't start?
- Check port 3000 is free
- Try: `cd frontend; npm install; npm run dev`

### Blank page in browser?
- Check both servers are running
- Clear browser cache
- Check console for errors (F12)

---

## 📊 System Status Check

Run this to verify everything:
```powershell
# Test backend
Invoke-RestMethod -Uri "http://localhost:3001/api/health"

# Should return: {"status":"healthy","timestamp":"..."}
```

---

## 🎯 What Judges Will See

- **Professional UI** - Command center aesthetic, not generic admin panel
- **Explainable AI** - Every recommendation shows WHY
- **Measurable Impact** - ₹8.7L opportunity quantified
- **Predictive** - 4.4 days advance warning, not reactive
- **Actionable** - Direct "Apply" buttons on recommendations

---

## 📚 Full Documentation

- **README.md** - Complete technical documentation
- **DEMO_GUIDE.md** - Detailed demo flow with Q&A
- **PROJECT_SUMMARY.md** - Full achievement summary

---

## ✅ Pre-Demo Checklist

- [ ] Both servers started successfully
- [ ] Browser opens to http://localhost:3000
- [ ] Command Center loads with Health Score 72/100
- [ ] Can see 5 AI recommendations
- [ ] Route optimization demo works
- [ ] All pages load without errors

---

**Time to demo:** < 5 minutes
**Confidence level:** 100%
**Ready status:** ✅ DEMO-READY

🚀 **Good luck with your presentation!**
