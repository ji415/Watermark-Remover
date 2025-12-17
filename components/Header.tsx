import React from 'react';
import { Eraser, Github } from 'lucide-react';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Eraser className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            {APP_NAME}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
