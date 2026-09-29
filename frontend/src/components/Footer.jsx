import React from "react";
import { Link } from "react-router-dom";
import { Radar, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import "./Footer.css";

const PLATFORM_LINKS = [
  { label: "Predictive Analytics", to: "/analytics" },
  { label: "Route Optimization", to: "/optimization" },
  { label: "Fleet & Warehouse Operations", to: "/fleet" },
  { label: "Inventory Risk Radar", to: "/inventory" },
  { label: "Shipment Monitoring", to: "/shipments" },
  { label: "Executive Reports", to: "/reports" },
];

const COMPANY_LINKS = [
  { label: "Landing Home", to: "/" },
  { label: "Control Hub", to: "/command-center" },
  { label: "Sign In", to: "/signin" },
  { label: "Sign Up", to: "/signup" },
];

function Footer() {
  return (
    <footer className="footer-grid bg-[#0F172A] text-slate-300 w-full border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand / Contact */}
        <div className="p-6 lg:p-8 lg:border-r border-slate-800/80">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Radar size={18} strokeWidth={2.5} />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-white tracking-tight">SC-LogiX</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            An AI-powered supply chain control hub &mdash; predictive visibility, automated optimization,
            and explainable decisions across national fleet, warehouse, and shipment networks.
          </p>

          <div className="space-y-2.5 text-sm text-slate-400">
            <p className="flex items-center gap-2.5">
              <Phone size={15} className="text-blue-400 shrink-0" />
              <span>+91 XXXXX XXXXX</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail size={15} className="text-blue-400 shrink-0" />
              <span>ops@sclogix.com</span>
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin size={15} className="text-blue-400 shrink-0" />
              <span>Pune, Maharashtra, India</span>
            </p>
          </div>
        </div>

        {/* Platform capabilities */}
        <div className="p-6 lg:p-8 lg:border-r border-slate-800/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <span>Platform Modules</span>
          </h2>
          <div className="flex flex-col space-y-2.5 text-sm text-slate-400">
            {PLATFORM_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company links + live status */}
        <div className="p-6 lg:p-8 lg:border-r border-slate-800/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
            Navigation &amp; Access
          </h2>
          <div className="flex flex-col space-y-2.5 text-sm text-slate-400 mb-6">
            {COMPANY_LINKS.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                  {item.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>All systems operational (99.9% uptime)</span>
          </div>
        </div>

        {/* Disclaimer & Social */}
        <div className="p-6 lg:p-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
            Operational Advisory
          </h2>

          <p className="text-sm leading-relaxed text-slate-400 mb-5">
            SC-LogiX provides predictive telemetry and explainable AI recommendations for
            supply chain, fleet, and warehouse operations. Outputs support operational decisions
            alongside domain expertise.
          </p>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Facebook size={16} /></a>
            <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Twitter size={16} /></a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 text-center px-4 py-4 text-xs font-medium text-slate-500">
        &copy; {new Date().getFullYear()} SC-LogiX Intelligent Supply Chain Network. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;
