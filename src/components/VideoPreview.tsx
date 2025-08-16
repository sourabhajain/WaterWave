import React, { useRef, useEffect } from 'react';

interface VideoPreviewProps {
  video: string;
  watermarkText?: string;
  logoImage?: string;
  color?: string;
  opacity: number;
  position: string;
}

export default function VideoPreview({
  video,
  watermarkText,
  logoImage,
  color = '#000000',
  opacity,
  position
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      if (video.paused || video.ended) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (watermarkText) {
        // Configure text watermark
        ctx.fillStyle = color + Math.floor(opacity * 2.55).toString(16).padStart(2, '0');
        ctx.font = `${canvas.height * 0.05}px Arial`;
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
        const logo = new Image();
        logo.src = logoImage;
        logo.onload = () => {
          // Calculate logo size (max 20% of video)
          const maxWidth = canvas.width * 0.2;
          const maxHeight = canvas.height * 0.2;
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

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    video.addEventListener('play', () => {
      drawFrame();
    });

    video.addEventListener('pause', () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    });

    // Auto-play the first frame to show preview
    video.addEventListener('loadeddata', () => {
      // Set canvas size immediately
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Draw the first frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [video, watermarkText, logoImage, color, opacity, position]);

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        src={video}
        className="hidden"
        preload="auto"
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg cursor-pointer"
        onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
      />
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {videoRef.current?.paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </div>
  );
}