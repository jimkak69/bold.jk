import React from 'react';

interface PreviewWindowProps {
  code: string | null;
}

const PreviewWindow: React.FC<PreviewWindowProps> = ({ code }) => {
  return (
    <div className="flex-1 flex flex-col bg-black m-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30">
       <div className="flex-shrink-0 bg-gray-900 px-4 py-3 flex items-center space-x-2 border-b border-white/10">
        <div className="w-3.5 h-3.5 bg-red-500 rounded-full"></div>
        <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full"></div>
        <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
        <div className="flex-1 text-center">
            <p className="text-sm text-gray-500">Preview</p>
        </div>
        <div className="w-12"></div>
       </div>
      <div className="w-full flex-1 bg-white">
        {code ? (
          <iframe
            srcDoc={code}
            title="Website Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white text-gray-400 p-8 text-center">
            <p>Your generated website will be previewed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewWindow;