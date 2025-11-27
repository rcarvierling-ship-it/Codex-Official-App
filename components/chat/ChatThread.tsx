"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

type Message = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

type ChatThreadProps = {
  entityType: "EVENT" | "TEAM" | "SCHOOL";
  entityId: string;
  currentUserId: string;
  users?: Map<string, { name: string; email: string }>;
};

export function ChatThread({ entityType, entityId, currentUserId, users = new Map() }: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/messages?entityType=${entityType}&entityId=${entityId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [entityType, entityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to send message");
      }

      setNewMessage("");
      await fetchMessages(); // Refresh messages
      inputRef.current?.focus();
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const entityLabel = entityType === "EVENT" ? "Game" : entityType === "TEAM" ? "Team" : "School";

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">{entityLabel} Chat</CardTitle>
        <p className="text-xs text-muted-foreground">
          Keep communication in-app. All messages are visible to everyone with access.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => {
                const user = users.get(message.userId);
                const isCurrentUser = message.userId === currentUserId;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex flex-col gap-1 ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        isCurrentUser
                          ? "bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {user?.name || "Unknown User"}
                      </p>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(message.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSubmitting}
            className="flex-1"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSubmitting}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}

