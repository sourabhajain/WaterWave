import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WatermarkControls from '../components/WatermarkControls';
import Preview from '../components/Preview';
import PdfPreview from '../components/PdfPreview';

export default function TextWatermark() {
  const navigate = useNavigate();
  const [text, setText] = useState('Your Watermark');
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState('center');

  const originalImage = localStorage.getItem('originalImage');
  const originalPdf = localStorage.getItem('originalPdf');

  useEffect(() => {
    // Store watermark settings for the preview page
    localStorage.setItem('watermarkText', text);
    localStorage.setItem('watermarkColor', color);
    localStorage.setItem('watermarkOpacity', opacity.toString());
    localStorage.setItem('watermarkPosition', position);
    // Clear any logo watermark data
    localStorage.removeItem('logoImage');
  }, [text, color, opacity, position]);

  if (!originalImage && !originalPdf) {
    navigate('/');
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <WatermarkControls
          text={text}
          setText={setText}
          color={color}
          setColor={setColor}
          opacity={opacity}
          setOpacity={setOpacity}
          position={position}
          setPosition={setPosition}
        />
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/preview')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Continue to Preview
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        {originalImage ? (
          <Preview
            image={originalImage}
            watermarkText={text}
            color={color}
            opacity={opacity}
            position={position}
          />
        ) : (
          <PdfPreview
            pdfData={originalPdf!}
            watermarkText={text}
            color={color}
            opacity={opacity}
            position={position}
          />
        )}
      </div>
    </div>
  );
}