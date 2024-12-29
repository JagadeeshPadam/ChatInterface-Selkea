import React from 'react';

export default function GraphView() {
  return (
    <div className="h-[50%] p-4 border-t border-teal-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Relations</h2>
      <div className="bg-teal-50 rounded-lg h-[calc(100%-2rem)] p-4 flex items-center justify-center border border-teal-100">
        <p className="text-gray-600">Graph visualization will be implemented here</p>
      </div>
    </div>
  );
}