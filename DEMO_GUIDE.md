# SC-LogiX Demo Guide for Judges

## 🎯 Quick Start (30 seconds)

**Both servers are already running!**

1. **Open your browser**: `http://localhost:3000`
2. You'll land on the **Command Center** - the heart of SC-LogiX
3. Follow the demo flow below for the best judging experience

---

## 🎬 Recommended Demo Flow (5-7 minutes)

### **Part 1: The Problem & Solution (30 seconds)**

**What you'll see:** Command Center dashboard

**Key points to mention:**
- "SC-LogiX addresses fragmented supply chain visibility"
- "72/100 health score indicates operational issues requiring attention"
- "2 shipments at risk, 4 stockout risks detected by AI"
- "₹1.3L in savings opportunities identified"

---

### **Part 2: AI Intelligence in Action (2 minutes)**

#### 2A. Shipment Delay Risk Detection

**What you'll see:** AI Operations Brief section showing critical shipment

**Demonstration:**
1. Point to **Shipment SHP-1048** with 82% delay probability
2. Explain the AI shows **WHY** it's at risk:
   - Route congestion (42%)
   - Vehicle utilization (28%)
   - Delivery window pressure (18%)
3. Show the AI recommendation: **Reassign to Vehicle V-204 + Route B**
4. Highlight the **measurable impact**:
   - ₹6,700 cost savings
   - 1.75 hours faster delivery
   - 19 percentage point risk reduction

**Key message:** "This isn't just an alert - it's actionable intelligence with quantified business impact"

#### 2B. Inventory Stockout Prediction

**What you'll see:** Second AI recommendation card

**Demonstration:**
1. Point to **SKU-2048 (Critical Component M)** stockout risk
2. Show current stock: 480 units, will run out in **4.4 days**
3. AI recommendation: Reorder 1,200 units immediately
4. Impact: Stockout probability drops from 71% → 12%

**Key message:** "Proactive, not reactive - preventing problems before they occur"

---

### **Part 3: Route Optimization Demo (2 minutes)**

**Navigation:** Click **"AI Optimization"** in sidebar

**Demonstration:**
1. Click **"Run Route Optimization"** button
2. Wait 1-2 seconds for results
3. Show the **Before/After comparison**:

**Current Plan:**
- Distance: 412 km
- Time: 8.67 hours
- Cost: ₹28,600
- Delay Risk: 31%

**AI Recommended:**
- Distance: 386 km (-6.3%)
- Time: 6.92 hours (-20.2%)
- Cost: ₹21,900 (-23.4%)
- Delay Risk: 12% (-19 pp)

4. Highlight the **Optimization Impact** section showing:
   - **₹6,700 saved**
   - **1.75 hours faster**
   - **26 km shorter**
   - **19 pp risk reduction**

**Key message:** "Every recommendation is explainable and measurable - not a black box"

---

### **Part 4: Inventory Risk Radar (1 minute)**

**Navigation:** Click **"Inventory"** in sidebar

**Demonstration:**
1. Show the summary cards:
   - 13 total SKUs tracked
   - 4 high-risk items requiring attention
2. Point to the **Inventory Risk Radar table**:
   - Real-time stockout probability for each SKU
   - Days remaining calculation
   - Automated reorder recommendations
3. Highlight **SKU-2048** row showing:
   - Current stock: 480
   - Daily demand: ~96 units
   - Days remaining: 4.4
   - Stockout risk: 78%
   - Recommended action: Reorder 1,200 units

**Key message:** "Visibility into every SKU with predictive intelligence"

---

### **Part 5: Predictive Analytics (1 minute)**

**Navigation:** Click **"Predictive Analytics"** in sidebar

**Demonstration:**
1. Show **Demand Forecast** chart:
   - 30-day prediction with confidence intervals
   - 92.4% forecast accuracy
   - Upper and lower bounds shown visually
2. Scroll to **Shipment Delay Prediction**:
   - Real-time risk assessment for all active shipments
   - Color-coded by severity (red = high, amber = medium, green = low)

**Key message:** "Forecasting future problems, not just reporting current state"

---

### **Part 6: Executive Value (1 minute)**

**Navigation:** Click **"Reports"** in sidebar

**Demonstration:**
1. Show **Executive Summary** metrics
2. Highlight **AI-Identified Savings Potential**:
   - Route optimization: ₹3.2L
   - Inventory optimization: ₹2.1L
   - Fleet allocation: ₹1.8L
   - Warehouse optimization: ₹1.6L
   - **Total: ₹8.7L**

3. Show **Performance Metrics**:
   - 2 shipments at risk
   - 4 stockout risks
   - Average warehouse capacity: 78.1%

**Key message:** "Clear ROI visibility for executives - ₹8.7L savings potential identified"

---

## 🎯 Key Differentiators to Emphasize

### 1. **Explainable AI**
- Every recommendation shows WHY (root cause)
- WHAT data influenced the decision
- WHAT WILL HAPPEN if we act
- WHAT HAPPENS if we don't

### 2. **Before/After Analysis**
- Clear visualization of optimization impact
- Quantified cost, time, and risk improvements
- No guessing - exact savings calculated

### 3. **Predictive Intelligence**
- Not reactive dashboards - proactive problem prevention
- 4.4 days advance warning on stockouts
- 82% delay probability before shipment fails
- 30-day demand forecasting

### 4. **Actionable Insights**
- Direct action buttons on recommendations
- Clear "Apply Recommendation" workflow
- Integrated decision support, not just reporting

### 5. **Business Focus**
- Every feature tied to cost/time savings
- ₹8.7L total opportunity quantified
- Executive-level reporting included
- ROI-focused design

---

## 🔧 Technical Highlights

**For technical judges:**

- **Frontend:** React + Vite + Tailwind CSS for modern, responsive UI
- **Backend:** Node.js + Express with RESTful API architecture
- **Database:** SQLite with 13 tables, realistic relationships
- **Analytics:** Statistical forecasting, risk scoring algorithms
- **Optimization:** Route comparison, fleet allocation, multi-modal analysis
- **Data Quality:** Intentional problems in demo data for AI to solve

---

## 📊 Demo Data Overview

**Intentionally includes operational problems:**

- **Warehouses:** 4 locations across India (Mumbai, Delhi, Bangalore, Chennai)
- **Products:** 10 SKUs with demand history
- **Inventory:** 13 records with 4 stockout risks, 1 overstock
- **Vehicles:** 9 vehicles with varying utilization
- **Shipments:** 6 shipments including 2 high-risk deliveries
- **Alerts:** 4 critical/high priority alerts requiring action
- **AI Recommendations:** 5 optimization opportunities worth ₹1.3L

---

## ⚡ Quick Navigation Guide

1. **Command Center** - Main dashboard, KPIs, AI operations brief
2. **Supply Chain Map** - (Placeholder for geographic visualization)
3. **Inventory** - Inventory risk radar with stockout predictions
4. **Warehouses** - Capacity monitoring, utilization tracking
5. **Shipments** - Shipment tracking with delay risk assessment
6. **Fleet Operations** - Vehicle status, utilization, efficiency
7. **AI Optimization** - Route/fleet optimization with before/after analysis
8. **Predictive Analytics** - Demand forecasting, delay predictions
9. **Insights & Alerts** - All alerts and AI recommendations
10. **Reports** - Executive summary and savings potential

---

## 💡 Pro Tips for Demo

1. **Start with impact:** Health score + ₹1.3L savings opportunity
2. **Show AI reasoning:** Click into any recommendation to see WHY
3. **Demonstrate optimization:** The route optimizer is the strongest visual
4. **Emphasize business value:** Always connect features to cost/time savings
5. **End with executive view:** Reports page shows total ₹8.7L opportunity

---

## ❓ Anticipated Questions & Answers

**Q: Is this using real machine learning models?**
A: The prototype uses statistical algorithms (moving averages, risk scoring, optimization heuristics) that demonstrate the intelligence layer. Production would integrate trained ML models.

**Q: How does the delay prediction work?**
A: It considers route congestion, vehicle utilization, historical patterns, delivery window constraints, and distance. Each factor's contribution is shown (e.g., congestion = 42% of risk).

**Q: Can this integrate with existing systems?**
A: Yes - the API architecture is designed for integration. It can consume data from ERP, TMS, WMS systems and provide intelligence back through REST APIs.

**Q: What's the data refresh rate?**
A: The prototype demonstrates real-time calculations. Production deployment would support configurable refresh intervals (real-time to hourly depending on data source).

**Q: How accurate are the forecasts?**
A: The demo shows 92.4% accuracy - in production, accuracy varies by SKU and is continuously measured and displayed with confidence intervals.

---

## 🚀 Success Criteria

**Judge should walk away thinking:**

1. ✅ "This solves a real supply chain visibility problem"
2. ✅ "The AI recommendations are explainable and actionable"
3. ✅ "The business value is clear - ₹8.7L savings quantified"
4. ✅ "This is production-ready thinking, not just a concept"
5. ✅ "The UI is professional and intuitive"

---

## 🎬 1-Minute Speed Demo

**If time is extremely limited:**

1. **Command Center:** "72/100 health score, 2 at-risk shipments, ₹1.3L savings identified"
2. **Click SHP-1048:** "82% delay probability - AI recommends different route, saves ₹6,700"
3. **AI Optimization:** "Before ₹28,600, After ₹21,900 - that's measurable impact"
4. **Reports:** "Total opportunity: ₹8.7L across route, inventory, fleet, warehouse optimization"

**Done in 60 seconds.**

---

**Good luck with the demo! 🚀**
