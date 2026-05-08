import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-2 rounded-lg">
                <Activity size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                SEO<span className="text-brand-600">Assist</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
