import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, FileText, Info } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-black-500 mb-4">Professional Watermarking Tool</h2>
        <p className="text-lg text-gray-800 font-Roboto">Turn Your Images into Protected Masterpieces</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <button
          onClick={() => navigate('/image')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center">
            <Image className="w-16 h-16 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Image Watermarking</h3>
            <p className="text-gray-600 text-center font-semibold">Seal Your Ownership with Style.!</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/pdf')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-col items-center">
            <FileText className="w-16 h-16 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">PDF Watermarking</h3>
            <p className="text-gray-600 text-center font-semibold">Defend Your PDFs with Unique Watermarking</p>
          </div>
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Why WaterWave?</h4>
            <ul className="text-gray-600 space-y-2">
              <li>• Protect your intellectual property</li>
              <li>• Brand your content professionally</li>
              <li>• Prevent unauthorized use</li>
              <li>• Maintain copyright control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}