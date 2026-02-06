import * as pdfjsLib from 'pdfjs-dist';

// Convert PDF to Word
export const convertPDFToWord = async (pdfFile) => {
try {
    // Read PDF file as ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    // convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Load PDF
//   const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
    }
    
    // Create a simple Word-like document (HTML format that Word can open)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Converted Document</title>
    </head>
    <body>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap; word-wrap: break-word;">${fullText}</pre>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '.doc');
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
} catch (err) {
    throw new Error('Failed to convert PDF: ' + err.message);
}
};
// Convert Word to PDF
export const convertWordToPDF = async (wordFile) => {
try {
    // Read Word file as ArrayBuffer
    const arrayBuffer = await wordFile.arrayBuffer();
    
    // Use mammoth to extract text from Word document
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pageWidth - (margin * 2);
    
    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(text, maxWidth);
    
    let y = margin;
    for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
    }
    
    doc.save(wordFile.name.replace(/\.(docx?|doc)$/i, '.pdf'));
    return true;
} catch (err) {
    throw new Error('Failed to convert Word document: ' + err.message);
}
};