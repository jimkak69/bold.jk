import React, { useState, useRef, useEffect } from 'react';
import type { WebsiteProject } from '../types';
import PromptInput from './PromptInput';
import CodeDisplay from './CodeDisplay';
import { MessageSquareIcon, FileCodeIcon, CheckIcon } from './icons';
import { enhancePrompt } from '../services/geminiService';

interface ChatPanelProps {
  project: WebsiteProject | undefined;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (prompt: string) => void;
  clearError: () => void;
}

type ActiveTab = 'chat' | 'code';

const ChatPanel: React.FC<ChatPanelProps> = ({ project, isLoading, error: mainError, onSendMessage, clearError }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [promptText, setPromptText] = useState('');
  const [enhancementError, setEnhancementError] = useState<string | null>(null);

  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [project?.chatHistory, activeTab]);

  const handleSendMessageWrapper = (prompt: string) => {
    onSendMessage(prompt);
    setPromptText('');
  };

  const handleEnhance = async () => {
    if (!promptText.trim() || isLoading || isEnhancing) return;

    setIsEnhancing(true);
    setEnhancementError(null);
    clearError();
    try {
      const enhanced = await enhancePrompt(promptText);
      setPromptText(enhanced);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during enhancement.';
      setEnhancementError(errorMessage);
    } finally {
      setIsEnhancing(false);
    }
  };
  
  const currentError = mainError || enhancementError;

  const renderChatHistory = () => {
    if (!project || project.chatHistory.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 text-gray-500 text-center">
          <p>Describe the website you want to create below, or use the ✨ button to enhance your idea.</p>
        </div>
      );
    }

    return (
      <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {project.chatHistory.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
               <div className="w-8 h-8 flex-shrink-0 bg-violet-800 text-violet-300 flex items-center justify-center rounded-full">
                  <CheckIcon className="w-5 h-5" />
               </div>
            )}
             <div className={`max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-white ${message.role === 'user' ? 'bg-violet-600' : 'bg-gray-800'}`}>
                <p className="text-sm whitespace-pre-wrap">
                  {message.role === 'assistant' ? 'I have updated the website code based on your request.' : message.content}
                </p>
             </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3 justify-start">
                 <div className="w-8 h-8 flex-shrink-0 bg-gray-800 text-gray-400 flex items-center justify-center rounded-full animate-pulse">
                    ...
                 </div>
                 <div className="max-w-md lg:max-w-lg rounded-xl px-4 py-3 bg-gray-800">
                    <p className="text-sm text-gray-400 animate-pulse">Generating...</p>
                 </div>
            </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black/20">
      <div className="flex-shrink-0 border-b border-white/10">
        <nav className="flex space-x-1 p-2">
          <TabButton icon={<MessageSquareIcon className="w-5 h-5" />} label="Chat" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <TabButton icon={<FileCodeIcon className="w-5 h-5" />} label="Code" isActive={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'chat' ? renderChatHistory() : <CodeDisplay code={project?.generatedCode ?? null} />}
      </div>
      
      {currentError && (
          <div className="mx-4 mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <strong>Error:</strong> {currentError}
          </div>
      )}

      {activeTab === 'chat' && (
        <PromptInput
          text={promptText}
          onTextChange={setPromptText}
          onSubmit={handleSendMessageWrapper}
          onEnhance={handleEnhance}
          isLoading={isLoading}
          isEnhancing={isEnhancing}
        />
      )}
    </div>
  );
};

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black ${
            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default ChatPanel;