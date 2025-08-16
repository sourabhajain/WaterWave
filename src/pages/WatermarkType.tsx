import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Image } from 'lucide-react';

export default function WatermarkType() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose Watermark Type</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={() => navigate('/text-watermark')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center">
            <Type className="w-16 h-16 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Text Watermark</h3>
            <p className="text-gray-600 text-center">Add custom text as your watermark</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/logo-watermark')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center">
            <Image className="w-16 h-16 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Logo Watermark</h3>
            <p className="text-gray-600 text-center">Use your logo as a watermark</p>
          </div>
        </button>
      </div>
    </div>
  );
}