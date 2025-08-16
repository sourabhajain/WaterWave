import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { validatePdfData, validateWatermarkText, validateImage } from './validation';
import { WatermarkOptions, Position, RGBColor, WatermarkContext } from './types';

const calculateWatermarkPosition = (
  width: number,
  height: number,
  position: string,
  elementWidth: number = 0,
  elementHeight: number = 0
): Position => {
  const positions: Record<string, Position> = {
    'center': { x: width / 2, y: height / 2 },
    'top-left': { x: width * 0.1, y: height * 0.9 - elementHeight },
    'top-center': { x: width / 2, y: height * 0.9 - elementHeight },
    'top-right': { x: width * 0.9 - elementWidth, y: height * 0.9 - elementHeight },
    'center-left': { x: width * 0.1, y: height / 2 },
    'center-right': { x: width * 0.9 - elementWidth, y: height / 2 },
    'bottom-left': { x: width * 0.1, y: height * 0.1 },
    'bottom-center': { x: width / 2, y: height * 0.1 },
    'bottom-right': { x: width * 0.9 - elementWidth, y: height * 0.1 }
  };

  return positions[position] || positions['center'];
};

const hexToRgb = (hex: string): RGBColor => {
  const color = hex.replace('#', '');
  const r = parseInt(color.slice(0, 2), 16) / 255;
  const g = parseInt(color.slice(2, 4), 16) / 255;
  const b = parseInt(color.slice(4, 6), 16) / 255;
  return { r, g, b };
};

const applyTextWatermark = async (
  ctx: WatermarkContext,
  text: string,
  size: number
): Promise<void> => {
  const { page, position, color, opacity } = ctx;
  if (!color) throw new Error('Color is required for text watermark');

  page.drawText(text, {
    x: position.x,
    y: position.y,
    size,
    opacity: opacity / 100,
    color: rgb(color.r, color.g, color.b),
    rotate: degrees(45)
  });
};

const applyImageWatermark = async (
  ctx: WatermarkContext,
  logoImage: string
): Promise<void> => {
  const { page, pdfDoc, position, opacity } = ctx;

  try {
    const logoDataUrl = logoImage.split(',')[1];
    if (!logoDataUrl) throw new Error('Invalid logo image format');

    const logoBytes = Uint8Array.from(atob(logoDataUrl), c => c.charCodeAt(0));
    const logo = await pdfDoc.embedPng(logoBytes);
    const logoDims = logo.scale(0.5);

    page.drawImage(logo, {
      x: position.x,
      y: position.y,
      width: logoDims.width,
      height: logoDims.height,
      opacity: opacity / 100
    });
  } catch (error) {
    throw new Error('Failed to process logo image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const applyWatermark = async (
  pdfData: string,
  options: WatermarkOptions
): Promise<Uint8Array> => {
  try {
    validatePdfData(pdfData);
    validateWatermarkText(options.text);
    await validateImage(options.logoImage);

    const pdfBytes = Uint8Array.from(atob(pdfData), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const color = options.color ? hexToRgb(options.color) : undefined;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const elementSize = options.text ? 0 : width * 0.2;
      
      const position = calculateWatermarkPosition(
        width,
        height,
        options.position,
        elementSize,
        elementSize
      );

      const ctx: WatermarkContext = {
        page,
        pdfDoc,
        position,
        color,
        opacity: options.opacity
      };

      if (options.text) {
        await applyTextWatermark(
          ctx,
          options.text,
          Math.min(width, height) * 0.05
        );
      } else if (options.logoImage) {
        await applyImageWatermark(ctx, options.logoImage);
      }
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error in applyWatermark:', error);
    throw error instanceof Error ? error : new Error('Failed to apply watermark to PDF');
  }
};