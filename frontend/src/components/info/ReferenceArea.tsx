import React from 'react';
import { FileText } from 'lucide-react';

interface Reference {
  id: string;
  title: string;
  excerpt: string;
  highlight: string;
  pdf_link: string; // pdfLink added to Reference interface
}

interface ReferenceAreaProps {
  references: Reference[]; // Expecting references to be passed as a prop
}

export default function ReferenceArea({ references = [] }: ReferenceAreaProps) { // Default to empty array
  return (
    <div className="h-[50%] p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Reference Documents</h2>
      {references.map((ref) => (
        <div key={ref.id} className="bg-teal-50 rounded-lg p-4 mb-4 border border-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="font-medium text-gray-800">{ref.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{ref.excerpt}</p>
          <div className="bg-white p-2 rounded border-l-4 border-teal-500">
            <p className="text-sm text-gray-700">{ref.highlight}</p>
          </div>
          {/* Embed the PDF link dynamically if it exists
          {ref.pdf_link && (
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-800">PDF Document</h4>
              <iframe
                src={ref.pdf_link}
                title="Reference PDF"
                width="100%"
                height="500px"
                className="border border-teal-200 rounded"
              ></iframe>
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
}
