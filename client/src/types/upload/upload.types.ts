export interface IUploadRecord {
  id: string;
  uploadedByUserId?: string | null;
  originalName: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  ocrExtractedData?: Record<string, any>;
  errorMessage?: string | null;
  createdAt?: string;
}
