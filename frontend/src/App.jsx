import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
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
        {/* Public Marketing & Auth Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Control Hub Application Shell */}
        <Route element={<Layout />}>
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/network" element={<SupplyChainMap />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/optimization" element={<Optimization />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
