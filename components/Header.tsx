import React from 'react';

interface HeaderProps {
  projectName: string;
}

const Header: React.FC<HeaderProps> = ({ projectName }) => {
  return (
    <header className="flex items-center flex-shrink-0 space-x-3 p-4 border-b border-white/10 bg-black">
      <div className="w-8 h-8 bg-violet-900/50 border border-violet-700/50 text-violet-400 flex items-center justify-center rounded-lg font-bold text-lg">
        {projectName.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-lg font-semibold text-gray-100 truncate" title={projectName}>{projectName}</h1>
    </header>
  );
};

export default Header;
