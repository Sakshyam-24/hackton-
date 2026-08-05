'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  File,
  X,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      addDocument(file);
    });
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      addDocument(file);
    });
  }, []);

  const addDocument = (file: File) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [...prev, newDoc]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id ? { ...doc, status: 'processing', progress: 100 } : doc
          )
        );

        // Simulate processing
        setTimeout(() => {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === newDoc.id ? { ...doc, status: 'ready' } : doc
            )
          );
        }, 2000);
      } else {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === newDoc.id ? { ...doc, progress } : doc
          )
        );
      }
    }, 300);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Documents</h1>
          <p className="text-dark-600">
            Upload legal documents for AI-powered analysis and summarization.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-dark-200 hover:border-primary-300 hover:bg-dark-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
              <Upload
                className={`w-12 h-12 mx-auto mb-4 ${
                  isDragOver ? 'text-primary-600' : 'text-dark-400'
                }`}
              />
              <p className="text-lg font-semibold text-dark-900 mb-2">
                {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-dark-500 mb-4">or click to browse</p>
              <p className="text-sm text-dark-400">
                Supports PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
            </motion.div>

            {/* Document List */}
            <div className="mt-6 space-y-3">
              <AnimatePresence>
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-200 cursor-pointer ${
                      selectedDoc?.id === doc.id
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-dark-100 hover:border-dark-200'
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 text-sm text-dark-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(doc.status)}
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                      {doc.status === 'uploading' && doc.progress !== undefined && (
                        <div className="mt-2 h-1.5 bg-dark-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${doc.progress}%` }}
                            className="h-full bg-primary-600 rounded-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.status === 'ready' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoc(doc);
                          }}
                          className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {documents.length === 0 && (
                <div className="text-center py-12">
                  <File className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                  <p className="text-dark-500">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 p-6 rounded-2xl bg-white border border-dark-100"
            >
              {selectedDoc ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-dark-900">Document Preview</h3>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="p-1 text-dark-400 hover:text-dark-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-full h-48 rounded-lg bg-dark-50 flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-dark-300" />
                  </div>

                  <h4 className="font-medium text-dark-900 mb-2 truncate">{selectedDoc.name}</h4>
                  <div className="space-y-2 text-sm text-dark-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(selectedDoc.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedDoc.type || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{new Date(selectedDoc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(selectedDoc.status)}
                        {getStatusText(selectedDoc.status)}
                      </span>
                    </div>
                  </div>

                  {selectedDoc.status === 'ready' && (
                    <button className="w-full mt-4 btn-primary">
                      Analyze Document
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Eye className="w-10 h-10 text-dark-300 mx-auto mb-3" />
                  <p className="text-dark-500">Select a document to preview</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
