import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import PreviewWindow from './components/PreviewWindow';
import { generateWebsiteCode } from './services/geminiService';
import type { WebsiteProject, Message } from './types';
import WebsiteList from './components/WebsiteList';
import ChatPanel from './components/ChatPanel';
import { CodeIcon } from './components/icons';

const PROJECTS_STORAGE_KEY = 'bolt-jk-projects';
const ACTIVE_PROJECT_ID_STORAGE_KEY = 'bolt-jk-active-project-id';

const App: React.FC = () => {
  const [projects, setProjects] = useState<WebsiteProject[]>(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return storedProjects ? JSON.parse(storedProjects) : [];
    } catch (error) {
      console.error("Failed to parse projects from localStorage", error);
      return [];
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_PROJECT_ID_STORAGE_KEY) ?? null;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, ensure a valid state.
    if (projects.length === 0) {
      const newProject: WebsiteProject = {
        id: `website-${Date.now()}`,
        name: 'New Website',
        chatHistory: [],
        generatedCode: null,
      };
      setProjects([newProject]);
      setActiveProjectId(newProject.id);
    } else if (!activeProjectId || !projects.some(p => p.id === activeProjectId)) {
      setActiveProjectId(projects[0].id);
    }
  }, []); // Run only once on mount

  // Persist state to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      if (activeProjectId) {
        localStorage.setItem(ACTIVE_PROJECT_ID_STORAGE_KEY, activeProjectId);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_ID_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [projects, activeProjectId]);

  const handleNewProject = useCallback(() => {
    const newProject: WebsiteProject = {
      id: `website-${Date.now()}`,
      name: `Website ${projects.length + 1}`,
      chatHistory: [],
      generatedCode: null,
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setError(null);
  }, [projects.length]);

  const handleSelectProject = useCallback((id: string) => {
    setActiveProjectId(id);
    setError(null);
  }, []);

  const handleDeleteProject = useCallback((idToDelete: string) => {
    const remainingProjects = projects.filter(p => p.id !== idToDelete);
    
    if (activeProjectId === idToDelete) {
      if (remainingProjects.length > 0) {
        setActiveProjectId(remainingProjects[0].id);
      } else {
        const newProject: WebsiteProject = {
          id: `website-${Date.now()}`,
          name: 'New Website',
          chatHistory: [],
          generatedCode: null,
        };
        setProjects([newProject]);
        setActiveProjectId(newProject.id);
        return;
      }
    }
    setProjects(remainingProjects);
  }, [projects, activeProjectId]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading || !activeProjectId) return;

    setIsLoading(true);
    setError(null);
    
    const projectsBeforeUpdate = JSON.parse(JSON.stringify(projects));
    const projectIndex = projects.findIndex(p => p.id === activeProjectId);

    if (projectIndex === -1) {
      setError("Active project not found. Please select a project.");
      setIsLoading(false);
      return;
    }

    const currentProject = projects[projectIndex];
    const userMessage: Message = { role: 'user', content: prompt };
    const updatedChatHistory = [...currentProject.chatHistory, userMessage];

    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = {
      ...currentProject,
      chatHistory: updatedChatHistory,
      name: currentProject.chatHistory.length === 0 && prompt.length > 0 ? prompt.substring(0, 40) + (prompt.length > 40 ? '...' : '') : currentProject.name,
    };
    setProjects(updatedProjects);

    try {
      const code = await generateWebsiteCode(updatedChatHistory);
      const assistantMessage: Message = { role: 'assistant', content: code };
      
      const finalProjects = [...updatedProjects];
      finalProjects[projectIndex] = {
        ...finalProjects[projectIndex],
        chatHistory: [...updatedChatHistory, assistantMessage],
        generatedCode: code,
      };
      setProjects(finalProjects);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setProjects(projectsBeforeUpdate); // Rollback on error
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans">
      <WebsiteList 
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onDeleteProject={handleDeleteProject}
      />
      <div className="flex flex-1 min-w-0">
        {activeProject ? (
          <>
            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col h-full border-r border-white/10">
               <Header projectName={activeProject.name} />
               <ChatPanel 
                 project={activeProject}
                 isLoading={isLoading}
                 error={error}
                 onSendMessage={handleSendMessage}
                 clearError={() => setError(null)}
               />
            </div>
            
            <div className="hidden md:flex flex-1 h-full">
               <PreviewWindow code={activeProject.generatedCode} />
            </div>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-8">
              <CodeIcon className="w-16 h-16 mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-gray-300">No Website Selected</h2>
              <p className="mt-2 max-w-sm">Create a new website using the button in the sidebar or select an existing one to continue working.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;