import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Home } from 'lucide-react';
import ImagePreview from '../components/Preview';
import PdfPreview from '../components/PdfPreview';

export default function PreviewPage() {
  const navigate = useNavigate();
  const originalImage = localStorage.getItem('originalImage');
  const originalPdf = localStorage.getItem('originalPdf');
  const pdfName = localStorage.getItem('pdfName') || 'watermarked.pdf';
  const watermarkText = localStorage.getItem('watermarkText');
  const logoImage = localStorage.getItem('logoImage');
  const color = localStorage.getItem('watermarkColor') || '#000000';
  const opacity = Number(localStorage.getItem('watermarkOpacity')) || 50;
  const position = localStorage.getItem('watermarkPosition') || 'center';

  if (!originalImage && !originalPdf) {
    navigate('/');
    return null;
  }

  const handleDownload = async () => {
    if (originalImage) {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'watermarked-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // Get the watermarked PDF blob from the iframe src
      const iframe = document.querySelector('iframe');
      if (!iframe || !iframe.src) return;
      
      const response = await fetch(iframe.src);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = pdfName.replace('.pdf', '-watermarked.pdf');
      link.click();
      
      URL.revokeObjectURL(link.href);
    }
  };

  const handleBackToHome = () => {
    // Clear localStorage before navigating
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Final Preview</h2>
        <div className="w-full overflow-auto">
          {originalImage ? (
            <ImagePreview
              image={originalImage}
              watermarkText={watermarkText || undefined}
              logoImage={logoImage || undefined}
              color={color}
              opacity={opacity}
              position={position}
            />
          ) : (
            <PdfPreview
              pdfData={originalPdf!}
              watermarkText={watermarkText || undefined}
              logoImage={logoImage || undefined}
              color={color}
              opacity={opacity}
              position={position}
            />
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download {originalImage ? 'Image' : 'PDF'}
        </button>
        <button
          onClick={handleBackToHome}
          className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}