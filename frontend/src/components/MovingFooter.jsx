import LogoLoop from './LogoLoop';

import mopsw from '../assets/movingFooterLogos/mposw.webp';
import concor from '../assets/movingFooterLogos/concor.png';
import ipa from '../assets/movingFooterLogos/ipa.png';
import jnpa from '../assets/movingFooterLogos/jnpa.svg';
import railway from '../assets/movingFooterLogos/railway.svg';
import dfccil from '../assets/movingFooterLogos/dfccil.png';
import sagarmal from '../assets/movingFooterLogos/sagarmal.jpg';

// Mixed formats (webp/png/svg/jpg) with unknown backgrounds — each logo gets its own white
// tile so they read consistently as a strip rather than clashing with the dark section
// background or with each other.
const LogoTile = ({ src, alt }) => (
  <div className="flex items-center justify-center h-14 w-32 rounded-xl bg-white border border-slate-200/80 px-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
    <img src={src} alt={alt} className="max-h-8 max-w-full object-contain" />
  </div>
);

const techLogos = [
  { type: 'node', node: <LogoTile src={mopsw} alt="Ministry of Ports, Shipping and Waterways" /> },
  { type: 'node', node: <LogoTile src={concor} alt="Container Corporation of India" /> },
  { type: 'node', node: <LogoTile src={ipa} alt="Indian Ports Association" /> },
  { type: 'node', node: <LogoTile src={jnpa} alt="Jawaharlal Nehru Port Authority" /> },
  { type: 'node', node: <LogoTile src={railway} alt="Indian Railways" /> },
  { type: 'node', node: <LogoTile src={dfccil} alt="Dedicated Freight Corridor Corporation of India" /> },
  { type: 'node', node: <LogoTile src={sagarmal} alt="Sagarmala Programme" /> },
];

function MovingFooter() {
  return (
    <div className="bg-slate-100/70 border-t border-slate-200/80 pt-6 pb-4">
      <p className="text-center text-xs font-bold tracking-wider uppercase text-slate-500 mb-3.5">
        Connected to India&apos;s National Logistics &amp; Freight Ecosystem
      </p>
      <div style={{ height: '78px', position: 'relative', overflow: 'hidden' }}>
        <LogoLoop
          logos={techLogos}
          speed={90}
          direction="left"
          logoHeight={40}
          gap={32}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#F1F5F9"
          ariaLabel="India's logistics and freight ecosystem"
        />
      </div>
    </div>
  );
}

export default MovingFooter;
