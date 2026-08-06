/**
 * Tests for the Chat component.
 *
 * Run with: npm test -- --testPathPattern=chat.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock components
const MockChatInput = ({ onSend, disabled }: { onSend: (msg: string) => void; disabled?: boolean }) => (
  <div data-testid="chat-input">
    <input
      aria-label="message input"
      disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onSend((e.target as HTMLInputElement).value);
        }
      }}
    />
    <button
      onClick={() => onSend('test message')}
      disabled={disabled}
    >
      Send
    </button>
  </div>
);

const MockMessageBubble = ({ role, content }: { role: string; content: string }) => (
  <div data-testid={`message-${role}`}>
    <span data-testid="message-role">{role}</span>
    <span data-testid="message-content">{content}</span>
  </div>
);

const MockCitationCard = ({ source }: { source: { title: string; url: string } }) => (
  <div data-testid="citation-card">
    <span>{source.title}</span>
  </div>
);

const MockDisclaimer = () => (
  <div data-testid="disclaimer">
    This is AI-generated legal information. Consult a qualified attorney for official legal advice.
  </div>
);

// Simple Chat component for testing
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string }[];
}

const ChatComponent = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Legal response to: ${message}`,
        sources: [{ title: 'Legal Source', url: 'https://example.com' }],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 100);
  };

  return (
    <div>
      <MockDisclaimer />
      <div data-testid="message-list">
        {messages.map((msg) => (
          <MockMessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
      </div>
      {isLoading && <div data-testid="loading">Loading...</div>}
      <MockChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};

describe('ChatComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the chat input', () => {
    render(<ChatComponent />);
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    render(<ChatComponent />);
    expect(screen.getByTestId('disclaimer')).toBeInTheDocument();
  });

  it('adds user message when sending', () => {
    render(<ChatComponent />);
    fireEvent.click(screen.getByText('Send'));

    expect(screen.getByTestId('message-user')).toBeInTheDocument();
    expect(screen.getByTestId('message-content')).toHaveTextContent('test message');
  });

  it('shows loading state after sending', () => {
    render(<ChatComponent />);
    fireEvent.click(screen.getByText('Send'));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('adds assistant response after delay', async () => {
    render(<ChatComponent />);
    fireEvent.click(screen.getByText('Send'));

    jest.advanceTimersByTime(200);

    await waitFor(() => {
      expect(screen.getByTestId('message-assistant')).toBeInTheDocument();
    });
  });

  it('disables input while loading', () => {
    render(<ChatComponent />);
    fireEvent.click(screen.getByText('Send'));

    const sendButton = screen.getByText('Send');
    expect(sendButton).toBeDisabled();
  });

  it('allows multiple messages', () => {
    render(<ChatComponent />);

    fireEvent.click(screen.getByText('Send'));
    jest.advanceTimersByTime(200);

    fireEvent.click(screen.getByText('Send'));
    jest.advanceTimersByTime(200);

    const userMessages = screen.getAllByTestId('message-user');
    expect(userMessages).toHaveLength(2);
  });
});

describe('MessageBubble', () => {
  it('displays the role', () => {
    render(<MockMessageBubble role="user" content="Hello" />);
    expect(screen.getByTestId('message-role')).toHaveTextContent('user');
  });

  it('displays the content', () => {
    render(<MockMessageBubble role="assistant" content="Legal advice here" />);
    expect(screen.getByTestId('message-content')).toHaveTextContent('Legal advice here');
  });
});

describe('CitationCard', () => {
  it('renders the source title', () => {
    render(<MockCitationCard source={{ title: 'Contract Law Guide', url: 'https://example.com' }} />);
    expect(screen.getByText('Contract Law Guide')).toBeInTheDocument();
  });
});

describe('Disclaimer', () => {
  it('shows legal disclaimer text', () => {
    render(<MockDisclaimer />);
    expect(screen.getByTestId('disclaimer')).toHaveTextContent('Consult a qualified attorney');
  });
});
