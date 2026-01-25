import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleScroll = (id: string) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/95 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center group cursor-pointer">
          <img src="/logo-full.png" alt="Schools24" className="h-10 object-contain" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link to="/partners" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
            Partners
          </Link>
          <Link to="/news" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
            News
          </Link>
          {['Services'].map((item) => (
            <button
              key={item}
              onClick={() => handleScroll(item.toLowerCase())}
              className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-white"
            >
              {item}
            </button>
          ))}
          <Link to="/contact" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
            Log In
          </button>
          <Link to="/register" className="px-6 py-2.5 bg-[#f59e0b] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
