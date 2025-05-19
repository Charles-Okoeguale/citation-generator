import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
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
            text: "Bibliography",
            heading: HeadingLevel.HEADING_1,
          }),
          ...(options.includeInText ? [
            new Paragraph({
              text: "In-text Citations",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            ...citations.map(citation =>
              new Paragraph({
                children: [
                  new TextRun(citation.inText),
                ],
                spacing: {
                  after: 200,
                },
              })
            ),
            new Paragraph({
              text: "Bibliography Entries",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
          ] : []),
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
    yPos += 15;

    if (options.includeInText) {
      pdf.setFontSize(14);
      pdf.text('In-text Citations', 20, yPos);
      yPos += 10;

      pdf.setFontSize(12);
      citations.forEach(citation => {
        const inTextLines = pdf.splitTextToSize(citation.inText, 170);
        inTextLines.forEach((line: string) => {
          if (yPos > 280) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos);
          yPos += 7;
        });
        yPos += 5;
      });

      yPos += 10;
      pdf.setFontSize(14);
      pdf.text('Bibliography Entries', 20, yPos);
      yPos += 10;
    }

    pdf.setFontSize(12);
    citations.forEach(citation => {
      const lines = pdf.splitTextToSize(citation.text, 170);
      lines.forEach((line: string) => {
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
      const author = citation.json.author?.[0];
      return `TY  - ${this.getCitationType(citation.json.type)}
${author ? `AU  - ${author.family || ''}, ${author.given || ''}` : ''}
TI  - ${citation.json.title || ''}
JO  - ${citation.json['container-title'] || ''}
PY  - ${this.getYear(citation.json)}
${citation.json.page ? `SP  - ${citation.json.page}` : ''}
${citation.json.DOI ? `DO  - ${citation.json.DOI}` : ''}
${citation.json.URL ? `UR  - ${citation.json.URL}` : ''}
ER  - 
`;
    }).join('\n');

    return new Blob([risContent], { type: 'application/x-research-info-systems' });
  }

  // Helper function to determine RIS citation type
  private getCitationType(cslType: string = ''): string {
    const typeMap: Record<string, string> = {
      'article-journal': 'JOUR', // Journal article
      'book': 'BOOK', // Book
      'chapter': 'CHAP', // Book chapter
      'webpage': 'ELEC', // Web page
      'article-newspaper': 'NEWS', // Newspaper article
      'article-magazine': 'MGZN', // Magazine article
      'thesis': 'THES', // Thesis
      'paper-conference': 'CONF', // Conference paper
      'report': 'RPRT', // Report
      'personal_communication': 'PCOMM', // Personal communication
    };
    
    return typeMap[cslType] || 'GEN'; // Default to generic
  }

  // Helper function to extract year from CSL-JSON
  private getYear(json: any): string {
    if (json.issued?.['date-parts']?.[0]?.[0]) {
      return json.issued['date-parts'][0][0].toString();
    }
    
    if (json.issued?.['raw']) {
      // Try to extract a year from raw date
      const yearMatch = json.issued.raw.match(/\d{4}/);
      if (yearMatch) return yearMatch[0];
    }
    
    return '';
  }

  // Download blob as a file
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

export const exportService = new ExportService();