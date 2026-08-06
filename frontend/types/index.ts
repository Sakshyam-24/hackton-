// ============================================================
// Core Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: 'en' | 'hi';
  fontSize: 'small' | 'medium' | 'large';
}

// ============================================================
// Chat Types
// ============================================================

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface Citation {
  id: string;
  title: string;
  section: string;
  act: string;
  description: string;
  relevance: number;
  url?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// ============================================================
// Legal Types
// ============================================================

export interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface LegalRoadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: RoadmapStep[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RoadmapStep {
  id: string;
  order: number;
  title: string;
  description: string;
  required: boolean;
  estimatedTime?: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  extractedText?: string;
  analysis?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  legalReferences: string[];
  riskAssessment?: string;
  recommendations?: string[];
}

// ============================================================
// State Types
// ============================================================

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  suggestedQuestions: string[];
  currentConversationId: string | null;
  conversationHistory: Conversation[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  filters: SearchFilters;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  source: string;
  url?: string;
  score: number;
}

export interface SearchFilters {
  dateRange: 'day' | 'week' | 'month' | 'year' | 'all';
  jurisdiction: string;
  actName: string;
  category: string;
}

// ============================================================
// UI Types
// ============================================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: string;
  type?: 'info' | 'warning' | 'danger' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// ============================================================
// Settings Types
// ============================================================

export interface Settings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  preferences: UserSettings;
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// ============================================================
// Analytics Types
// ============================================================

export interface Analytics {
  totalQueries: number;
  totalConversations: number;
  averageResponseTime: number;
  mostUsedCategories: CategoryUsage[];
  recentActivity: ActivityEntry[];
  usageByDay: DailyUsage[];
}

export interface CategoryUsage {
  category: string;
  count: number;
  percentage: number;
}

export interface ActivityEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface DailyUsage {
  date: string;
  queries: number;
  conversations: number;
}

// ============================================================
// API Request Types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  category?: string;
  language?: 'en' | 'ne';
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface DocumentUploadRequest {
  file: File;
  title: string;
  description?: string;
  category: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface SettingsUpdateRequest {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: 'en' | 'hi';
  fontSize?: 'small' | 'medium' | 'large';
}

// ============================================================
// API Response Types
// ============================================================

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  citations: Citation[];
  disclaimer: string;
  legal_category?: string;
  sources: any[];
  timestamp: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Hook Types
// ============================================================

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  suggestedQuestions: string[];
  currentConversationId: string | null;
  sendMessage: (content: string, category?: string) => Promise<void>;
  clearChat: () => void;
  loadConversation: (id: string) => Promise<void>;
}

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
}

// ============================================================
// Component Props Types
// ============================================================

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
