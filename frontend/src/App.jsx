import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import SupplyChainMap from './pages/SupplyChainMap';
import Inventory from './pages/Inventory';
import Warehouses from './pages/Warehouses';
import Shipments from './pages/Shipments';
import Fleet from './pages/Fleet';
import Optimization from './pages/Optimization';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandCenter />} />
          <Route path="command-center" element={<CommandCenter />} />
          <Route path="network" element={<SupplyChainMap />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="optimization" element={<Optimization />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
