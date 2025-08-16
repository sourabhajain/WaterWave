import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageDropzoneProps {
  onImageDrop: (file: File) => void;
}

export default function ImageDropzone({ onImageDrop }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: files => files[0] && onImageDrop(files[0])
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-500">
        {isDragActive ? (
          <>
            <Upload className="w-12 h-12 mb-4 text-blue-500" />
            <p className="text-blue-500">Drop your image here...</p>
          </>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 mb-4" />
            <p className="mb-2 font-medium">Drag & drop your image here</p>
            <p className="text-sm">or click to select a file</p>
          </>
        )}
      </div>
    </div>
  );
}