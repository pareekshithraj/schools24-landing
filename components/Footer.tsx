
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="text-2xl font-black tracking-tight mb-6">Schools24</div>
            <p className="max-w-xs text-slate-500 leading-relaxed font-medium">
              India's most trusted school admission and management network. Built for the next billion students.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6">Discovery</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-600">
              <li><a href="#" className="hover:underline">Search Schools</a></li>
              <li><a href="#" className="hover:underline">Compare Fees</a></li>
              <li><a href="#" className="hover:underline">Real Reviews</a></li>
              <li><a href="#" className="hover:underline">Scholarships</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6">Management</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-600">
              <li><a href="#" className="hover:underline">ERP Pro</a></li>
              <li><a href="#" className="hover:underline">Admission CRM</a></li>
              <li><a href="#" className="hover:underline">Exam Engine</a></li>
              <li><a href="#" className="hover:underline">Digital ID</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6">Connect</h4>
            <ul className="space-y-4 text-[13px] font-semibold text-slate-600">
              <li><a href="https://linkedin.schools24.in" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a></li>
              <li><a href="https://x.schools24.in" target="_blank" rel="noopener noreferrer" className="hover:underline">X (Twitter)</a></li>
              <li><a href="https://instagram.schools24.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
              <li><a href="https://facebook.schools24.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 text-[11px] text-slate-400 font-medium flex flex-col md:row items-center justify-between gap-6">
          <p>Copyright © 2024 Schools24.in Inc. All rights reserved. Registered in Bangalore, India.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Use</a>
            <a href="#" className="hover:text-black">Sales Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
