import { PDFDocument, PDFPage } from 'pdf-lib';

export interface WatermarkOptions {
  text?: string;
  logoImage?: string;
  color?: string;
  opacity: number;
  position: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface WatermarkContext {
  page: PDFPage;
  pdfDoc: PDFDocument;
  position: Position;
  color?: RGBColor;
  opacity: number;
}