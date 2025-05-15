import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import type { CitationOutput } from '../types';

export interface ExportOptions {
  format: 'pdf' | 'word' | 'bibtex' | 'ris';
  includeInText?: boolean;
  filename?: string;
}

class ExportService {
  async exportToWord(citations: CitationOutput[], options: ExportOptions): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Bibliography",
                bold: true,
                size: 28,
              }),
            ],
          }),
          ...citations.map(citation => 
            new Paragraph({
              children: [
                new TextRun(citation.text),
              ],
              spacing: {
                after: 200,
              },
            })
          ),
        ],
      }],
    });

    return await Packer.toBlob(doc);
  }

  // Export to PDF
  async exportToPDF(citations: CitationOutput[], options: ExportOptions): Promise<Blob> {
    const pdf = new jsPDF();
    let yPos = 20;

    pdf.setFontSize(16);
    pdf.text('Bibliography', 20, yPos);
    yPos += 10;

    pdf.setFontSize(12);
    citations.forEach(citation => {
      const lines = pdf.splitTextToSize(citation.text, 170);
      lines.forEach((line: string | string[]) => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, 20, yPos);
        yPos += 7;
      });
      yPos += 10;
    });

    return pdf.output('blob');
  }

  // Export to BibTeX file
  async exportToBibTeX(citations: CitationOutput[]): Promise<Blob> {
    const bibtexContent = citations.map(citation => citation.bibtex).join('\n\n');
    return new Blob([bibtexContent], { type: 'application/x-bibtex' });
  }

  // Export to RIS format
  async exportToRIS(citations: CitationOutput[]): Promise<Blob> {
    // Convert citation data to RIS format
    const risContent = citations.map(citation => {
      return `TY  - JOUR
AU  - ${citation.json.author?.[0]?.family}, ${citation.json.author?.[0]?.given}
TI  - ${citation.json.title}
JO  - ${citation.json['container-title']}
PY  - ${citation.json.issued?.['date-parts']?.[0]?.[0]}
SP  - ${citation.json.page}
ER  - 
`;
    }).join('\n');

    return new Blob([risContent], { type: 'application/x-research-info-systems' });
  }

  // Download helper
  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();