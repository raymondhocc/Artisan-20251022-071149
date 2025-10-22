import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Bot, User, History, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService, generateSessionTitle } from '@/lib/chat';
import type { ChatState, SessionInfo, ToolCall } from '../../worker/types';
import { useCanvasAI } from '@/hooks/use-canvas-ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
const formatToolCall = (toolCall: ToolCall): string => {
  if (toolCall.name !== 'canvas_tool' || !toolCall.result) return "Performing an action...";
  const args = toolCall.result as any;
  const { action, elementType, properties } = args;
  switch (action) {
    case 'add':
      return `Added a new ${elementType || 'element'}`;
    case 'update': {
      const updatedProps = properties ? Object.keys(properties).join(', ') : '';
      return `Updated ${updatedProps || 'properties'}`;
    }
    case 'delete':
      return `Deleted an element`;
    case 'bringToFront':
      return `Brought element to front`;
    case 'sendToBack':
      return `Sent element to back`;
    default:
      return `Canvas action: ${action}`;
  }
};
export function AIDesignAssistantPanel() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: chatService.getSessionId(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    streamingMessage: ''
  });
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [hasUnsavedSession, setHasUnsavedSession] = useState(false);
  const { processToolCalls } = useCanvasAI();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [chatState.messages, chatState.streamingMessage]);
  const loadCurrentSession = useCallback(async () => {
    const response = await chatService.getMessages();
    if (response.success && response.data) {
      setChatState(prev => ({
        ...prev,
        ...response.data,
        sessionId: chatService.getSessionId()
      }));
      if (response.data.messages) {
        const lastMessage = response.data.messages[response.data.messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage.toolCalls) {
          processToolCalls(lastMessage.toolCalls);
        }
      }
    }
  }, [processToolCalls]);
  const loadSessions = useCallback(async () => {
    const response = await chatService.listSessions();
    if (response.success && response.data) {
      setSessions(response.data);
    }
  }, []);
  useEffect(() => {
    loadCurrentSession();
    loadSessions();
  }, [loadCurrentSession, loadSessions]);
  useEffect(() => {
    const currentSessionExists = sessions.some(s => s.id === chatState.sessionId);
    setHasUnsavedSession(chatState.messages.length > 0 && !currentSessionExists);
  }, [chatState.messages, chatState.sessionId, sessions]);
  const saveCurrentSessionIfNeeded = async () => {
    if (hasUnsavedSession) {
      const firstUserMessage = chatState.messages.find(m => m.role === 'user');
      const title = generateSessionTitle(firstUserMessage?.content);
      await chatService.createSession(title, chatState.sessionId, firstUserMessage?.content);
      await loadSessions();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatState.isProcessing) return;
    const message = input.trim();
    setInput('');
    if (hasUnsavedSession && chatState.messages.length === 0) {
      const title = generateSessionTitle(message);
      await chatService.createSession(title, chatState.sessionId, message);
      await loadSessions();
    }
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      streamingMessage: ''
    }));
    await chatService.sendMessage(message, chatState.model, (chunk) => {
      setChatState(prev => ({
        ...prev,
        streamingMessage: (prev.streamingMessage || '') + chunk
      }));
    });
    await loadCurrentSession();
    setChatState(prev => ({ ...prev, isProcessing: false }));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleNewChat = async () => {
    await saveCurrentSessionIfNeeded();
    chatService.newSession();
    setChatState({
      messages: [],
      sessionId: chatService.getSessionId(),
      isProcessing: false,
      model: chatState.model,
      streamingMessage: ''
    });
    await loadSessions();
  };
  const handleSwitchSession = async (sessionId: string) => {
    if (sessionId === chatState.sessionId) return;
    await saveCurrentSessionIfNeeded();
    chatService.switchSession(sessionId);
    await loadCurrentSession();
  };
  const handleClearAllSessions = async () => {
    await chatService.clearAllSessions();
    await handleNewChat();
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold font-display">AI Assistant</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowSessions(!showSessions)}>
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Session History</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>New Chat</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0">
        {showSessions && (
          <div className="p-4 border-b flex items-center gap-2">
            <Select value={chatState.sessionId} onValueChange={handleSwitchSession}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>{session.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleClearAllSessions}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Clear All Sessions</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-4">
            {chatState.messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 animate-fade-in">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>How can I help you design?</p>
                <p className="text-sm">Try: "Add a large red square"</p>
              </div>
            )}
            {chatState.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && <Bot className="w-5 h-5 flex-shrink-0 mt-1" />}
                <div className={`max-w-[90%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary rounded-bl-none'
                }`}>
                  {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-current/20 space-y-1">
                      {msg.toolCalls.map((tool, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <Wrench className="w-3 h-3 mr-1.5" />
                          {formatToolCall(tool)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && <User className="w-5 h-5 flex-shrink-0 mt-1" />}
              </motion.div>
            ))}
            {chatState.streamingMessage && (
              <div className="flex gap-2 justify-start">
                <Bot className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="bg-secondary p-3 rounded-lg rounded-bl-none max-w-[90%]">
                  <p className="text-sm whitespace-pre-wrap">{chatState.streamingMessage}<span className="animate-pulse">|</span></p>
                </div>
              </div>
            )}
            {chatState.isProcessing && !chatState.streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-secondary p-3 rounded-lg">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                        style={{animationDelay: `${i * 150}ms`}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2 items-start">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Make the circle blue"
              className="flex-1 min-h-[42px] max-h-24 resize-none"
              rows={1}
              disabled={chatState.isProcessing}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || chatState.isProcessing}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}