import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  image: string;
  watermarkText?: string;
  logoImage?: string;
  color?: string;
  opacity: number;
  position: string;
}

export default function Preview({
  image,
  watermarkText,
  logoImage,
  color = '#000000',
  opacity,
  position
}: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mainImage = new Image();
    mainImage.src = image;
    mainImage.onload = () => {
      // Set canvas size to match image
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;

      // Draw main image
      ctx.drawImage(mainImage, 0, 0);

      if (watermarkText) {
        // Configure text watermark
        ctx.fillStyle = color + Math.floor(opacity * 2.55).toString(16).padStart(2, '0');
        ctx.font = '48px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Calculate position for text
        let x = canvas.width / 2;
        let y = canvas.height / 2;

        if (position.includes('left')) x = canvas.width * 0.2;
        if (position.includes('right')) x = canvas.width * 0.8;
        if (position.includes('top')) y = canvas.height * 0.2;
        if (position.includes('bottom')) y = canvas.height * 0.8;

        // Draw text watermark
        ctx.fillText(watermarkText, x, y);
      } else if (logoImage) {
        // Draw logo watermark
        const logo = new Image();
        logo.src = logoImage;
        logo.onload = () => {
          // Calculate logo size (max 20% of main image)
          const maxWidth = mainImage.width * 0.2;
          const maxHeight = mainImage.height * 0.2;
          let logoWidth = logo.width;
          let logoHeight = logo.height;

          if (logoWidth > maxWidth) {
            const scale = maxWidth / logoWidth;
            logoWidth *= scale;
            logoHeight *= scale;
          }
          if (logoHeight > maxHeight) {
            const scale = maxHeight / logoHeight;
            logoWidth *= scale;
            logoHeight *= scale;
          }

          // Calculate position for logo
          let x = (canvas.width - logoWidth) / 2;
          let y = (canvas.height - logoHeight) / 2;

          if (position.includes('left')) x = canvas.width * 0.05;
          if (position.includes('right')) x = canvas.width * 0.95 - logoWidth;
          if (position.includes('top')) y = canvas.height * 0.05;
          if (position.includes('bottom')) y = canvas.height * 0.95 - logoHeight;

          // Set global alpha for opacity
          ctx.globalAlpha = opacity / 100;

          // Draw logo
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);

          // Reset global alpha
          ctx.globalAlpha = 1;
        };
      }
    };
  }, [image, watermarkText, logoImage, color, opacity, position]);

  return (
    <div className="w-full overflow-auto">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
      />
    </div>
  );
}