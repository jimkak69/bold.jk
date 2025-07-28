
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-white animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 rounded-full bg-white animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
    </div>
  );
};

export default Loader;
