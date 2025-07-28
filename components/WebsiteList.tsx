import React from 'react';
import type { WebsiteProject } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface WebsiteListProps {
  projects: WebsiteProject[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

const WebsiteList: React.FC<WebsiteListProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
}) => {
  return (
    <div className="w-64 bg-black/50 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-violet-400"><path d="m12 1-9.5 9.5 4 4L12 9l5.5 5.5 4-4L12 1z"></path><path d="M12 22 2.5 12.5l4-4L12 14l5.5-5.5 4 4L12 22z"></path></svg>
          <h1 className="text-xl font-bold text-gray-100">bolt.jk</h1>
        </div>
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-dashed border-white/20 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/5 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Website</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {projects.map((project) => (
          <div key={project.id} className="group relative">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectProject(project.id);
              }}
              className={`flex items-center space-x-3 pl-3 pr-10 py-2.5 rounded-md text-sm font-medium transition-colors w-full ${
                project.id === activeProjectId
                  ? 'bg-violet-500/10 text-violet-300'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className="w-6 h-6 flex-shrink-0 bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center rounded-md font-bold text-xs">
                  {project.name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{project.name}</span>
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProject(project.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500/50"
              aria-label={`Delete project ${project.name}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default WebsiteList;