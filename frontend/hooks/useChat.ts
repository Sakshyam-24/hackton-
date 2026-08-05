'use client';

import { useState, useCallback } from 'react';
import { chatService } from '@/services/chatService';
import { generateId } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { Message, UseChatReturn } from '@/types';

const DEFAULT_SUGGESTED_QUESTIONS = [
  'What are my rights as a tenant under Nepal law?',
  'Can you explain Section 302 of the Nepal Penal Code?',
  'What is the process for filing a consumer complaint in Nepal?',
  'What are the grounds for divorce under Hindu Marriage Act?',
];

export function useChat(conversationId?: string): UseChatReturn {
  const { language } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    DEFAULT_SUGGESTED_QUESTIONS
  );
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    conversationId || null
  );

  const sendMessage = useCallback(
    async (content: string, category?: string) => {
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setIsStreaming(true);
      setError(null);

      const assistantId = generateId();
      const placeholderMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        const response = await chatService.sendMessage({
          message: content,
          conversation_id: currentConversationId || undefined,
          category,
          language,
        });

        // Update the placeholder with the actual response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: response.response || 'No response generated.',
                  isStreaming: false,
                  citations: response.citations,
                }
              : msg
          )
        );

        if (response.conversation_id) {
          setCurrentConversationId(response.conversation_id);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get response. Please try again.';
        setError(errorMessage);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content:
                    'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [currentConversationId, language]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    setCurrentConversationId(null);
    setSuggestedQuestions(DEFAULT_SUGGESTED_QUESTIONS);
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const conversation = await chatService.getConversation(id);
      setMessages(conversation.messages || []);
      setCurrentConversationId(conversation.id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load conversation.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    suggestedQuestions,
    currentConversationId,
    sendMessage,
    clearChat,
    loadConversation,
  };
}

export default useChat;
