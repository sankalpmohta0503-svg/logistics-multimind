import LogoLoop from './LogoLoop';

import routeIcon from '../assets/movingHeaderLogos/route.svg';
import truckIcon from '../assets/movingHeaderLogos/truck.svg';
import warehouseIcon from '../assets/movingHeaderLogos/warehouse.svg';
import containerIcon from '../assets/movingHeaderLogos/container.svg';
import shipIcon from '../assets/movingHeaderLogos/ship.svg';
import inventoryIcon from '../assets/movingHeaderLogos/inventory.svg';
import analyticsIcon from '../assets/movingHeaderLogos/analytics.svg';

// These are real .svg files (unlike some icon assets used elsewhere that were SVG markup
// saved with a different extension), so they're used the standard Vite way: imported as a
// URL and rendered through <img>.
const IconBadge = ({ src, label }) => (
  <div className="flex flex-col items-center justify-center gap-1.5 w-[118px] group py-1">
    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200/80 shadow-sm group-hover:border-blue-400 group-hover:shadow-md group-hover:scale-105 transition-all">
      <img src={src} alt="" aria-hidden="true" className="w-5.5 h-5.5 object-contain" />
    </span>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 text-center leading-tight group-hover:text-blue-600 transition-colors px-1">
      {label}
    </span>
  </div>
);

const techLogos = [
  { type: 'node', node: <IconBadge src={routeIcon} label="Route Optimization" />, ariaLabel: 'Route Optimization' },
  { type: 'node', node: <IconBadge src={truckIcon} label="Fleet Tracking" />, ariaLabel: 'Fleet Tracking' },
  { type: 'node', node: <IconBadge src={warehouseIcon} label="Warehouse Ops" />, ariaLabel: 'Warehouse Ops' },
  { type: 'node', node: <IconBadge src={containerIcon} label="Container Visibility" />, ariaLabel: 'Container Visibility' },
  { type: 'node', node: <IconBadge src={shipIcon} label="Ocean Freight" />, ariaLabel: 'Ocean Freight' },
  { type: 'node', node: <IconBadge src={inventoryIcon} label="Inventory Risk" />, ariaLabel: 'Inventory Risk' },
  { type: 'node', node: <IconBadge src={analyticsIcon} label="Predictive Analytics" />, ariaLabel: 'Predictive Analytics' },
];

function MovingHeader() {
  return (
    <div className="bg-slate-100/70 border-b border-slate-200/80 flex flex-col justify-center" style={{ height: '114px', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={techLogos}
        speed={85}
        direction="left"
        logoHeight={72}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#F1F5F9"
        ariaLabel="SC-LogiX platform capabilities"
      />
    </div>
  );
}

export default MovingHeader;
