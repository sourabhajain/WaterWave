import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Video } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function VideoWatermark() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.webm']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB max
    onDrop: files => {
      if (files[0]) {
        setError(null);
        setUploading(true);
        
        // Create video element to check duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          if (video.duration > 300) { // 5 minutes max
            setError('Video must be shorter than 5 minutes');
            setUploading(false);
            return;
          }
          
          localStorage.setItem('originalVideo', URL.createObjectURL(files[0]));
          setUploading(false);
          navigate('/watermark-type');
        };
        
        video.src = URL.createObjectURL(files[0]);
      }
    },
    onDropRejected: () => {
      setError('Please upload a valid video file (MP4 or WebM) under 100MB');
    }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Upload Your Video</h2>
      
      <div className="bg-white rounded-xl p-8 shadow-sm">
        {uploading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your video...</p>
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
                    <p className="text-blue-500 text-lg">Drop your video here...</p>
                  </>
                ) : (
                  <>
                    <Video className="w-16 h-16 mb-4" />
                    <p className="text-lg mb-2 font-medium">Drag & drop your video here</p>
                    <p className="text-sm text-gray-400">Supports MP4 and WebM formats (max 100MB, 5 min)</p>
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