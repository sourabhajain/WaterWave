import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

export default function PdfWatermark() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max
    onDrop: async (files) => {
      if (files[0]) {
        setError(null);
        setUploading(true);
        
        try {
          // Load and validate PDF
          const fileBuffer = await files[0].arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer);
          
          if (pdfDoc.getPageCount() > 100) {
            throw new Error('PDF must be less than 100 pages');
          }
          
          // Convert PDF to base64
          const reader = new FileReader();
          reader.onload = () => {
            const base64data = (reader.result as string).split(',')[1];
            localStorage.setItem('originalPdf', base64data);
            localStorage.setItem('pdfName', files[0].name);
            setUploading(false);
            navigate('/watermark-type');
          };
          reader.readAsDataURL(files[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid PDF file');
          setUploading(false);
        }
      }
    },
    onDropRejected: () => {
      setError('Please upload a valid PDF file under 10MB');
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Upload Your PDF</h2>
      
      <div className="bg-white rounded-xl p-8 shadow-sm">
        {uploading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your PDF...</p>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              className={`w-full p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-gray-500">
                {isDragActive ? (
                  <>
                    <Upload className="w-16 h-16 mb-4 text-blue-500" />
                    <p className="text-blue-500 text-lg">Drop your PDF here...</p>
                  </>
                ) : (
                  <>
                    <FileText className="w-16 h-16 mb-4" />
                    <p className="text-lg mb-2 font-medium">Drag & drop your PDF here</p>
                    <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
                  </>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}