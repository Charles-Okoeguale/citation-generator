'use client';

import { useState, useEffect } from 'react';
import type { CitationOutput } from '@/lib/citation/types';

interface CitationEditorProps {
  citation: CitationOutput;
  onChange: (updatedCitation: CitationOutput) => void;
}

interface EditHistory {
  citations: CitationOutput[];
  currentIndex: number;
}

export function CitationEditor({ citation, onChange }: CitationEditorProps) {
  const [editableHtml, setEditableHtml] = useState(citation.html);
  const [editableText, setEditableText] = useState(citation.text);
  const [editableInText, setEditableInText] = useState(citation.inText);
  const [activeFormat, setActiveFormat] = useState<'html' | 'text' | 'inText'>('html');
  const [history, setHistory] = useState<EditHistory>({
    citations: [citation],
    currentIndex: 0
  });

  // Update history when citation changes
  const updateHistory = (updatedCitation: CitationOutput) => {
    setHistory(prev => {
      const newHistory = {
        citations: [
          ...prev.citations.slice(0, prev.currentIndex + 1),
          updatedCitation
        ],
        currentIndex: prev.currentIndex + 1
      };
      return newHistory;
    });
  };

  // Undo/Redo functions
  const undo = () => {
    if (history.currentIndex > 0) {
      const prevIndex = history.currentIndex - 1;
      const prevCitation = history.citations[prevIndex];
      setHistory(prev => ({ ...prev, currentIndex: prevIndex }));
      setEditableHtml(prevCitation.html);
      setEditableText(prevCitation.text);
      setEditableInText(prevCitation.inText);
      onChange(prevCitation);
    }
  };

  const redo = () => {
    if (history.currentIndex < history.citations.length - 1) {
      const nextIndex = history.currentIndex + 1;
      const nextCitation = history.citations[nextIndex];
      setHistory(prev => ({ ...prev, currentIndex: nextIndex }));
      setEditableHtml(nextCitation.html);
      setEditableText(nextCitation.text);
      setEditableInText(nextCitation.inText);
      onChange(nextCitation);
    }
  };

  // Formatting controls
  const applyFormat = (format: 'bold' | 'italic' | 'underline') => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = format;
    range.surroundContents(span);

    const updatedCitation = {
      ...citation,
      html: document.getElementById('citation-editor')?.innerHTML || citation.html
    };
    updateHistory(updatedCitation);
    onChange(updatedCitation);
  };

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveFormat('html')}
          className={`px-3 py-1 rounded ${
            activeFormat === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveFormat('text')}
          className={`px-3 py-1 rounded ${
            activeFormat === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Plain Text
        </button>
        <button
          onClick={() => setActiveFormat('inText')}
          className={`px-3 py-1 rounded ${
            activeFormat === 'inText' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          In-text
        </button>
      </div>

      {/* Formatting Controls */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => applyFormat('bold')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <u>U</u>
        </button>
        <button
          onClick={undo}
          disabled={history.currentIndex === 0}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={history.currentIndex === history.citations.length - 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      {/* Citation Editor */}
      <div
        id="citation-editor"
        contentEditable
        className="p-4 border rounded-lg min-h-[100px] font-serif"
        dangerouslySetInnerHTML={{
          __html: activeFormat === 'html' ? editableHtml :
                 activeFormat === 'text' ? editableText :
                 editableInText
        }}
        onBlur={(e) => {
          const newContent = e.currentTarget.innerHTML;
          const updatedCitation = {
            ...citation,
            [activeFormat]: newContent
          };
          updateHistory(updatedCitation);
          onChange(updatedCitation);
        }}
      />

      {/* Preview */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Preview</h4>
        <div 
          className="p-4 bg-gray-50 rounded-lg font-serif"
          dangerouslySetInnerHTML={{
            __html: activeFormat === 'html' ? editableHtml :
                   activeFormat === 'text' ? editableText :
                   editableInText
          }}
        />
      </div>
    </div>
  );
}