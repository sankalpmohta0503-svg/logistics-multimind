import React from 'react';
import Header2 from '../components/Header2';
import MovingHeader from '../components/MovingHeader';
import MainContent from './MainContent';
import MovingFooter from '../components/MovingFooter';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header2 />
      <MovingHeader />
      <MainContent />
      <MovingFooter />
      <Footer />
    </div>
  );
}

export default HomePage;