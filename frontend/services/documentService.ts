import apiClient from '@/services/api';
import type {
  Document,
  DocumentUploadRequest,
  DocumentAnalysis,
  PaginatedResponse,
} from '@/types';

class DocumentService {
  async upload(data: DocumentUploadRequest): Promise<Document> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('category', data.category);
    if (data.description) {
      formData.append('description', data.description);
    }

    return apiClient.upload<Document>('/api/v1/documents/upload', formData);
  }

  async getDocuments(
    page = 1,
    limit = 20,
    category?: string
  ): Promise<PaginatedResponse<Document>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (category) params.append('category', category);

    return apiClient.get<PaginatedResponse<Document>>(
      `/api/v1/documents?${params.toString()}`
    );
  }

  async getDocument(id: string): Promise<Document> {
    return apiClient.get<Document>(`/api/v1/documents/${id}`);
  }

  async deleteDocument(id: string): Promise<void> {
    await apiClient.del(`/api/v1/documents/${id}`);
  }

  async analyzeDocument(id: string): Promise<DocumentAnalysis> {
    return apiClient.post<DocumentAnalysis>(`/api/v1/documents/${id}/analyze`);
  }

  async getDocumentText(id: string): Promise<{ text: string }> {
    return apiClient.get<{ text: string }>(`/api/v1/documents/${id}/text`);
  }

  async searchDocuments(query: string, category?: string): Promise<Document[]> {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);

    return apiClient.get<Document[]>(
      `/api/v1/documents/search?${params.toString()}`
    );
  }
}

export const documentService = new DocumentService();
export default documentService;

