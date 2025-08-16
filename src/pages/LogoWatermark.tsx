import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDropzone from '../components/ImageDropzone';
import Preview from '../components/Preview';
import PdfPreview from '../components/PdfPreview';

export default function LogoWatermark() {
  const navigate = useNavigate();
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState('center');

  const originalImage = localStorage.getItem('originalImage');
  const originalPdf = localStorage.getItem('originalPdf');

  useEffect(() => {
    if (logoImage) {
      // Store watermark settings for the preview page
      localStorage.setItem('logoImage', logoImage);
      localStorage.setItem('watermarkOpacity', opacity.toString());
      localStorage.setItem('watermarkPosition', position);
      // Clear any text watermark data
      localStorage.removeItem('watermarkText');
      localStorage.removeItem('watermarkColor');
    }
  }, [logoImage, opacity, position]);

  if (!originalImage && !originalPdf) {
    navigate('/');
    return null;
  }

  const handleLogoDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upload Your Logo</h3>
          <ImageDropzone onImageDrop={handleLogoDrop} />
        </div>

        {logoImage && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Tailor Your Watermark</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500">Opacity: {opacity}%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={`p-2 border rounded-md ${
                        position === pos
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/preview')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          disabled={!logoImage}
        >
          Continue to Preview
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        {logoImage ? (
          originalImage ? (
            <Preview
              image={originalImage}
              logoImage={logoImage}
              opacity={opacity}
              position={position}
            />
          ) : (
            <PdfPreview
              pdfData={originalPdf!}
              logoImage={logoImage}
              opacity={opacity}
              position={position}
            />
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            Upload a logo to see the preview
          </div>
        )}
      </div>
    </div>
  );
}