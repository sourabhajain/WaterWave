import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageDropzone from '../components/ImageDropzone';

export default function ImageWatermark() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleImageDrop = (file: File) => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      localStorage.setItem('originalImage', URL.createObjectURL(file));
      setUploading(false);
      navigate('/watermark-type');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Upload Your Image</h2>
      
      <div className="bg-white rounded-xl p-8 shadow-sm">
        {uploading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Uploading your image...</p>
          </div>
        ) : (
          <ImageDropzone onImageDrop={handleImageDrop} />
        )}
      </div>
    </div>
  );
}