import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-semibold">Access Restricted</h1>
        <p className="text-white/60">
          You don't have permission to access this portal. Please contact your administrator or switch roles.
        </p>
        <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
