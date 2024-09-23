// Loading.jsx
import React from 'react';

const Loading = () => (
  <div className="flex items-center justify-center h-[70vh]">
    <div className="relative w-10 h-10">
      <div className="absolute border-4 border-gray-300 border-t-transparent rounded-full w-full h-full animate-spin"></div>
    </div>
    <span className="ml-4 text-gray-300 text-xl">Loading...</span>
  </div>
);

export default Loading;
