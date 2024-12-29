import React from 'react';
import ReferenceArea from './ReferenceArea';
import GraphView from './GraphView';

interface InfoPanelProps {
  references: any[]; // Accept references as prop
}

export default function InfoPanel({ references }: InfoPanelProps) {
  return (
    <div className="flex flex-col w-[400px] border-l border-teal-100 bg-white">
      <ReferenceArea references={references} />
      <GraphView />
    </div>
  );
}
