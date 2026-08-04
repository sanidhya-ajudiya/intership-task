import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel p-12 rounded-3xl text-center space-y-6 max-w-md border border-gray-800">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-gray-200">Page Not Found</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          The requested page or resource could not be found on NEXUS MARKET. Please verify the URL or navigate back to safety.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
