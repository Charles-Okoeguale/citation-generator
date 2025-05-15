'use client';

import { createContext, useContext, useState } from 'react';
import type { CitationOutput } from '@/lib/citation/types';

interface CitationEditContextType {
  editedCitation: CitationOutput | null;
  setEditedCitation: (citation: CitationOutput) => void;
  undoStack: CitationOutput[];
  redoStack: CitationOutput[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const CitationEditContext = createContext<CitationEditContextType | undefined>(undefined);

export function CitationEditProvider({ children }: { children: React.ReactNode }) {
  const [editedCitation, setEditedCitation] = useState<CitationOutput | null>(null);
  const [undoStack, setUndoStack] = useState<CitationOutput[]>([]);
  const [redoStack, setRedoStack] = useState<CitationOutput[]>([]);

  const updateCitation = (citation: CitationOutput) => {
    setUndoStack(prev => [...prev, editedCitation!]);
    setRedoStack([]);
    setEditedCitation(citation);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const previousCitation = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, editedCitation!]);
    setEditedCitation(previousCitation);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const nextCitation = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, editedCitation!]);
    setEditedCitation(nextCitation);
  };

  return (
    <CitationEditContext.Provider
      value={{
        editedCitation,
        setEditedCitation: updateCitation,
        undoStack,
        redoStack,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undo,
        redo
      }}
    >
      {children}
    </CitationEditContext.Provider>
  );
}

export function useCitationEdit() {
  const context = useContext(CitationEditContext);
  if (context === undefined) {
    throw new Error('useCitationEdit must be used within a CitationEditProvider');
  }
  return context;
}