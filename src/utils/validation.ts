export const validatePdfData = (pdfData: string): void => {
  if (!pdfData || typeof pdfData !== 'string') {
    throw new Error('Invalid PDF data provided');
  }
  
  try {
    const decoded = atob(pdfData);
    if (decoded.length === 0) {
      throw new Error('Empty PDF data');
    }
  } catch {
    throw new Error('Invalid base64 PDF data');
  }
};

export const validateWatermarkText = (text?: string): void => {
  if (!text) return;
  
  if (text.length === 0) {
    throw new Error('Watermark text cannot be empty');
  }
  
  if (text.length > 100) {
    throw new Error('Watermark text cannot exceed 100 characters');
  }
};

export const validateImage = async (dataUrl?: string): Promise<void> => {
  if (!dataUrl) return;
  
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Invalid image format');
  }
  
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error('Failed to load image');
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Invalid image type');
    }
  } catch (error) {
    throw new Error('Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};