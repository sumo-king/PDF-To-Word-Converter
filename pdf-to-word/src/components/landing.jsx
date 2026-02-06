import { useState } from 'react';
import { FileText, Upload, Download, RefreshCw } from 'lucide-react';
import { convertPDFToWord, convertWordToPDF } from '../services/converters';
/**
 * Main component for the PDF to Word converter
 * @returns {JSX.Element}
 */
const PDFWordConverter = () => {
  const [mode, setMode] = useState('pdf-to-word'); // 'pdf-to-word' or 'word-to-pdf'
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState('');
    // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConverted(false);
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setConverting(true);
    setError('');

    try {
      (mode === 'pdf-to-word') ? await convertPDFToWord(file) : await convertWordToPDF(file);
      setConverted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setConverting(false);
    }
  };

  const resetConverter = () => {
    setFile(null);
    setConverted(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Document Converter
            </h1>
            <p className="text-gray-600">Convert between PDF and Word formats</p>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setMode('pdf-to-word');
                resetConverter();
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'pdf-to-word'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              PDF → Word
            </button>
            <button
              onClick={() => {
                setMode('word-to-pdf');
                resetConverter();
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'word-to-pdf'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Word → PDF
            </button>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">
                  {mode === 'pdf-to-word' ? 'PDF files only' : 'Word files (.doc, .docx)'}
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={mode === 'pdf-to-word' ? '.pdf' : '.doc,.docx'}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={!file || converting}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {converting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : converted ? (
              <>
                <Download className="w-5 h-5" />
                Download Started!
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Convert File
              </>
            )}
          </button>

          {/* Reset Button */}
          {(file || converted) && (
            <button
              onClick={resetConverter}
              className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Convert Another File
            </button>
          )}

          {/* Success Message */}
          {converted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                ✓ Conversion complete! Your file has been downloaded.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All conversions happen in your browser. No files are uploaded to any server.
          </p>
        </div>
      </div>

      {/* Load Required Libraries */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </div>
  );
};

export default PDFWordConverter;