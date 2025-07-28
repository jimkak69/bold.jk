import React from 'react';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySet }) => {
  const handleContinue = () => {
    // Optimistically assume the user has set the key. The parent component will re-render.
    // The next API call will either succeed or fail, re-triggering this screen if necessary.
    onKeySet();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-gray-200">
      <div className="w-full max-w-2xl mx-auto p-8 bg-black/50 border border-white/10 rounded-xl shadow-2xl shadow-black/50">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-4 text-violet-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
          <h1 className="text-2xl font-bold text-white mb-2">Provide Your OpenRouter API Key</h1>
          <p className="text-gray-400 mb-6">
            This application requires an OpenRouter API key to function. Please set it in your browser's local storage to continue.
          </p>
        </div>

        <div className="bg-black/40 p-6 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300 mb-4">
            <strong>Step 1:</strong> Open your browser's developer console.
            <br />
            <span className="text-xs text-gray-500">(Usually F12, or Ctrl+Shift+I on Windows, Cmd+Opt+I on Mac)</span>
          </p>

          <p className="text-sm text-gray-300 mb-4">
            <strong>Step 2:</strong> Copy and paste the following code into the console, replacing{' '}
            <code className="bg-violet-500/10 text-violet-300 px-1 py-0.5 rounded">YOUR_KEY_HERE</code> with your actual OpenRouter API key.
          </p>

          <pre className="bg-black p-4 rounded-md text-sm text-violet-300 whitespace-pre-wrap break-words font-mono relative group">
            <code>localStorage.setItem('openrouter-api-key', 'YOUR_KEY_HERE');</code>
            <button
              onClick={() => navigator.clipboard.writeText("localStorage.setItem('openrouter-api-key', 'YOUR_KEY_HERE');")}
              className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Copy code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </pre>

          <p className="text-sm text-gray-300 mt-4">
            <strong>Step 3:</strong> After running the command in the console, click the button below to proceed.
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleContinue}
            className="w-full max-w-xs px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black transition-colors"
          >
            I've Set My Key, Continue
          </button>
        </div>
         <p className="text-xs text-gray-600 mt-6 text-center">
            Your key is stored only in your browser's local storage and is never sent anywhere except directly to OpenRouter.
          </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
