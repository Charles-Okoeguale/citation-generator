'use client';

import { academicDisciplines } from '@/lib/citation/types';
import { useState } from 'react';

interface DisciplineSelectorProps {
  selectedDiscipline: string;
  onDisciplineSelect: (discipline: string) => void;
}

export function DisciplineSelector({ 
  selectedDiscipline, 
  onDisciplineSelect 
}: DisciplineSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {academicDisciplines.map((discipline : any) => (
          <button
            key={discipline.id}
            onClick={() => {
              onDisciplineSelect(discipline.id);
              setIsExpanded(true);
            }}
            className={`px-4 py-2 rounded-full text-sm transition-colors
              ${selectedDiscipline === discipline.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            {discipline.name}
          </button>
        ))}
      </div>

      {/* Expanded discipline info */}
      {isExpanded && selectedDiscipline && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">
            {academicDisciplines.find((d: { id: string; }) => d.id === selectedDiscipline)?.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {academicDisciplines.find((d: { id: string; }) => d.id === selectedDiscipline)?.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {academicDisciplines
              .find((d: { id: string; }) => d.id === selectedDiscipline)
              ?.subfields.map((subfield: any) => (
                <span
                  key={subfield}
                  className="px-2 py-1 bg-white rounded text-xs text-gray-600 border"
                >
                  {subfield.replace('-', ' ')}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}