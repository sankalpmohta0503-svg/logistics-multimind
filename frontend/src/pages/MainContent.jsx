import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Route,
  Truck,
  Warehouse,
  PackageSearch,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Database,
  Radar,
  Workflow,
  FileText,
} from 'lucide-react';
import './MainContent.css';

import dfc from '../assets/homeImages/dfc.jfif';
import dfccil from '../assets/homeImages/dfccil.jfif';
import jpna from '../assets/homeImages/jpna.jpg';
import minister from '../assets/homeImages/minister.jpg';

// --- Static content ---------------------------------------------------------

const SLIDES = [
  { src: dfc, caption: 'Dedicated Freight Corridor infrastructure' },
  { src: dfccil, caption: 'Freight corridor operations' },
  { src: jpna, caption: 'Port & maritime operations' },
  { src: minister, caption: 'Policy & infrastructure context' },
];

const PROBLEMS = [
  'Shipment status scattered across carriers, spreadsheets, and phone calls',
  'Route and fleet decisions made reactively, after delays already happened',
  'Inventory risk noticed only once a warehouse is already short or overstocked',
];

const SOLUTIONS = [
  'One control hub for shipment, fleet, and warehouse visibility',
  'Predictive alerts before disruptions turn into delays',
  'Every recommendation comes with the reasoning behind it',
];

const CAPABILITIES = [
  { icon: TrendingUp, title: 'Predictive Analytics', copy: 'Forecast delays, demand shifts, and disruptions before they hit the schedule.', link: '/analytics' },
  { icon: Route, title: 'Route Optimization', copy: 'Continuously recalculated routes that balance cost, time, and reliability.', link: '/optimization' },
  { icon: Truck, title: 'Fleet Optimization', copy: 'Right vehicle, right load, right time — across the entire fleet.', link: '/fleet' },
  { icon: Warehouse, title: 'Inventory & Warehouse Intelligence', copy: 'Stock-out and overstock risk flagged before it becomes a problem.', link: '/inventory' },
  { icon: PackageSearch, title: 'Shipment Monitoring', copy: 'Live status on every shipment, from dispatch to delivery.', link: '/shipments' },
  { icon: BrainCircuit, title: 'Explainable AI', copy: 'Every prediction and recommendation comes with a clear, traceable reason.', link: '/alerts' },
];

const WORKFLOW = [
  { icon: Database, title: 'Ingest', copy: 'Bring in fleet, warehouse, and shipment data from across the network.' },
  { icon: Radar, title: 'Predict', copy: 'Surface likely delays, risks, and demand shifts ahead of time.' },
  { icon: Workflow, title: 'Optimize', copy: 'Recalculate routes and fleet allocation against current conditions.' },
  { icon: PackageSearch, title: 'Monitor', copy: 'Track every shipment and warehouse signal in real time.' },
  { icon: FileText, title: 'Explain & Act', copy: 'Get a ranked, explainable recommendation — and act on it.' },
];

// --- Motion variants --------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroWord = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function MainContent() {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const headline = 'Predictive visibility for your entire supply chain.';

  return (
    <main className="bg-[#F4F7FB] text-slate-900 font-sans">
      {/* --- Hero --- */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-24">
        <div className="hero-scanline" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Next-Gen Logistics Intelligence</span>
            </div>

            <motion.h1
              className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {headline.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  variants={heroWord}
                  className={`inline-block mr-2 ${word === 'supply' || word === 'chain.' ? 'gradient-text' : ''}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              SC-LogiX is an AI-powered supply chain control hub &mdash; unifying fleet, warehouse,
              and shipment data into live predictions, explainable decisions, and automated risk prevention.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-full shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                Get started free
                <ArrowRight size={18} />
              </button>
              <Link
                to="/command-center"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold px-6 py-3.5 rounded-full shadow-sm hover:border-slate-300 transition-all"
              >
                Open Live Hub
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors"
              >
                Sign in &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Carousel */}
          <motion.div
            className="relative w-full h-72 lg:h-[400px] rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <img
                  src={SLIDES[slideIndex].src}
                  alt={SLIDES[slideIndex].caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent p-5">
                  <p className="text-sm font-semibold text-white">{SLIDES[slideIndex].caption}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-4 right-4 flex gap-1.5 z-10 bg-slate-900/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slideIndex ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Problem & Solution --- */}
      <section className="py-20 border-t border-slate-200/80 bg-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Supply chains run on fragmented visibility. SC-LogiX fixes that.
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              From isolated spreadsheets to unified, intelligent control tower orchestration.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="rounded-2xl border border-rose-100 bg-white p-8 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-2.5 mb-5 text-rose-600">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center border border-rose-100">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">The Traditional Problem</h3>
              </div>
              <ul className="space-y-3.5">
                {PROBLEMS.map((item) => (
                  <li key={item} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-2.5 mb-5 text-emerald-600">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">The SC-LogiX Solution</h3>
              </div>
              <ul className="space-y-3.5">
                {SOLUTIONS.map((item) => (
                  <li key={item} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Capabilities --- */}
      <section className="py-20 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center max-w-xl mx-auto mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything the Control Hub Watches
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Six predictive capabilities working in harmony, delivering continuous operational edge.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
          >
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <motion.div key={cap.title} variants={fadeUp}>
                  <Link 
                    to={cap.link} 
                    className="capability-card group block p-6 h-full border border-slate-200/70"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <Icon size={20} />
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {cap.copy}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* --- Workflow --- */}
      <section className="py-20 border-t border-slate-200/80 bg-slate-50/80">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center max-w-xl mx-auto mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The SC-LogiX Autonomous Workflow
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Continuous 5-stage loop transforming raw telemetry into audited, executable decisions.
            </p>
          </motion.div>

          <motion.div
            className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-0.5 bg-slate-200 -z-0" />

            {WORKFLOW.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} variants={fadeUp} className="relative flex flex-col items-center text-center z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 shadow-md shadow-blue-500/10 mb-4 transition-transform hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-blue-600 mb-1 tracking-wide">{`STAGE 0${i + 1}`}</span>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.copy}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* --- CTA --- */}
      <motion.section
        className="py-16 border-t border-slate-200/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-10 lg:p-14 text-white text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Put your supply chain on the Control Hub
              </h2>
              <p className="text-blue-100 max-w-xl mx-auto text-sm lg:text-base mb-8 leading-relaxed">
                Connect your fleet, warehouse, and shipment data to identify operational bottlenecks before they turn into costly delays.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-blue-700 font-bold px-8 py-3.5 rounded-full shadow-lg transition-all active:scale-[0.98]"
                >
                  Create your account
                  <ArrowRight size={18} />
                </button>
                <Link
                  to="/command-center"
                  className="inline-flex items-center gap-2 bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-full transition-all"
                >
                  View live demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default MainContent;
