import React from 'react';
import Loader from './Loader';
import { SparklesIcon } from './icons';

interface PromptInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSubmit: (prompt: string) => void;
  onEnhance: () => Promise<void>;
  isLoading: boolean;
  isEnhancing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ text, onTextChange, onSubmit, onEnhance, isLoading, isEnhancing }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const anyLoading = isLoading || isEnhancing;

  return (
    <div className="p-4 border-t border-white/10">
      <div className="relative">
        <textarea
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg shadow-sm p-3 pr-36 text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-500 resize-none"
          placeholder="e.g., A modern portfolio for a photographer..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={anyLoading}
          aria-label="Chat input"
        />
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <button
            onClick={onEnhance}
            disabled={anyLoading || !text.trim()}
            className="flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-violet-300 bg-violet-600/30 hover:bg-violet-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Enhance prompt with AI"
            title="Enhance prompt with AI"
          >
            {isEnhancing ? <Loader /> : <SparklesIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleSubmit}
            disabled={anyLoading || !text.trim()}
            className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Send message"
          >
            {isLoading ? <Loader /> : 'Send'}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        You can use Ctrl/Cmd+Enter to send.
      </p>
    </div>
  );
};

export default PromptInput;
