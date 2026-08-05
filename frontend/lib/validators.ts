import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ChatMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be less than 5000 characters'),
  conversationId: z.string().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export const SearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .min(3, 'Search query must be at least 3 characters')
    .max(200, 'Search query must be less than 200 characters'),
  category: z.string().optional(),
  filters: z
    .object({
      dateRange: z.enum(['day', 'week', 'month', 'year', 'all']).optional(),
      jurisdiction: z.string().optional(),
      actName: z.string().optional(),
    })
    .optional(),
});

export type SearchInput = z.infer<typeof SearchSchema>;

export const DocumentUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file instanceof File, 'File is required')
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size must be less than 10MB'
    )
    .refine(
      (file) =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ].includes(file.type),
      'File must be a PDF, DOC, DOCX, or TXT file'
    ),
  title: z
    .string()
    .min(1, 'Document title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category: z.string().min(1, 'Please select a category'),
});

export type DocumentUploadInput = z.infer<typeof DocumentUploadSchema>;

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
}).refine(
  (data) => {
    if (data.currentPassword && !data.newPassword) return false;
    if (!data.currentPassword && data.newPassword) return false;
    return true;
  },
  {
    message: 'Both current and new password are required to change password',
    path: ['newPassword'],
  }
);

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

export const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  language: z.enum(['en', 'hi']).optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
});

export type SettingsInput = z.infer<typeof SettingsSchema>;
