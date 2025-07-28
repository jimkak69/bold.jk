import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeDisplayProps {
  code: string | null;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
    }
  };

  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500 text-center">
        <p>The generated website code will appear here once the AI responds.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black/20 overflow-hidden">
      <div className="flex justify-between items-center bg-black/30 px-4 py-2 border-b border-white/10">
        <span className="text-sm font-medium text-gray-300">Generated Code (HTML)</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Copy code"
          disabled={!code}
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
          <span className="pr-1">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm text-violet-300 whitespace-pre-wrap break-words font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
