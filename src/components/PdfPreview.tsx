import React, { useEffect, useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

interface PdfPreviewProps {
  pdfData: string;
  watermarkText?: string;
  logoImage?: string;
  color?: string;
  opacity: number;
  position: string;
}

export default function PdfPreview({
  pdfData,
  watermarkText,
  logoImage,
  color = '#000000',
  opacity,
  position
}: PdfPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const applyWatermark = async () => {
      try {
        // Create a Uint8Array from the base64 PDF data
        const pdfBytes = new Uint8Array(
          atob(pdfData)
            .split('')
            .map(char => char.charCodeAt(0))
        );

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        // Convert hex color to RGB
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;

        // Apply watermark to each page
        for (const page of pages) {
          const { width, height } = page.getSize();
          
          if (watermarkText) {
            // Calculate position for text watermark
            let x = width / 2;
            let y = height / 2;

            if (position.includes('left')) x = width * 0.2;
            if (position.includes('right')) x = width * 0.8;
            if (position.includes('top')) y = height * 0.8;
            if (position.includes('bottom')) y = height * 0.2;

            // Draw text watermark
            page.drawText(watermarkText, {
              x,
              y,
              size: Math.min(width, height) * 0.05,
              opacity: opacity / 100,
              color: rgb(r, g, b),
              rotate: degrees(45)
            });
          } else if (logoImage) {
            try {
              // Extract MIME type from data URL
              const mimeType = logoImage.split(',')[0].split(':')[1].split(';')[0];
              const logoDataUrl = logoImage.split(',')[1];
              
              // Convert logo data URL to bytes
              const logoBytes = new Uint8Array(
                atob(logoDataUrl)
                  .split('')
                  .map(char => char.charCodeAt(0))
              );

              // Embed the logo based on its format
              let logo;
              if (mimeType === 'image/png') {
                logo = await pdfDoc.embedPng(logoBytes);
              } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
                logo = await pdfDoc.embedJpg(logoBytes);
              } else {
                throw new Error(`Unsupported image format: ${mimeType}. Please use PNG or JPEG.`);
              }
              
              const scaleFactor = 0.2;
              const logoWidth = width * scaleFactor;
              const aspectRatio = logo.width / logo.height;
              const logoHeight = logoWidth / aspectRatio;

              // Calculate position for logo
              let x = (width - logoWidth) / 2;
              let y = (height - logoHeight) / 2;

              if (position.includes('left')) x = width * 0.1;
              if (position.includes('right')) x = width * 0.9 - logoWidth;
              if (position.includes('top')) y = height * 0.9 - logoHeight;
              if (position.includes('bottom')) y = height * 0.1;

              // Draw logo watermark
              page.drawImage(logo, {
                x,
                y,
                width: logoWidth,
                height: logoHeight,
                opacity: opacity / 100
              });
            } catch (error) {
              console.error('Error embedding logo:', error);
              setError('Error embedding logo. Please try a different image.');
            }
          }
        }

        // Save the modified PDF and create a preview URL
        const modifiedPdfBytes = await pdfDoc.save();
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Update the preview URL
        setPreviewUrl(url);
      } catch (error) {
        console.error('Error applying watermark:', error);
        setError('Error applying watermark. Please try again.');
      }
    };

    if (pdfData) {
      applyWatermark();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [pdfData, watermarkText, logoImage, color, opacity, position]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden bg-gray-100">
      {previewUrl ? (
        <iframe
          src={previewUrl + '#toolbar=0'}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}