"use client";

import { Message } from "./openrouter";

// Types for message storage
export interface ConversationHistory {
  id: string;
  messages: StoredMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

// Maximum number of messages to retrieve for context
const MAX_CONTEXT_MESSAGES = 10;

// Local storage key
const CONVERSATION_STORAGE_KEY = "libratrack_conversations";

/**
 * Save a conversation message to local storage
 */
export function saveMessage(
  conversationId: string,
  message: StoredMessage
): void {
  if (typeof window === "undefined") return;

  try {
    // Get existing conversations
    const storedData = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    const conversations: ConversationHistory[] = storedData
      ? JSON.parse(storedData)
      : [];

    // Find or create conversation
    const existingConversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (existingConversationIndex >= 0) {
      // Add message to existing conversation
      const conversation = conversations[existingConversationIndex];
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      conversations[existingConversationIndex] = conversation;
    } else {
      // Create new conversation
      const newConversation: ConversationHistory = {
        id: conversationId,
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      conversations.push(newConversation);
    }

    // Save back to local storage
    localStorage.setItem(
      CONVERSATION_STORAGE_KEY,
      JSON.stringify(conversations)
    );
  } catch (error) {
    console.error("Error saving message to storage:", error);
  }
}

/**
 * Get conversation history for a specific conversation
 */
export function getConversationHistory(
  conversationId: string,
  maxMessages: number = MAX_CONTEXT_MESSAGES
): StoredMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!storedData) return [];

    const conversations: ConversationHistory[] = JSON.parse(storedData);
    const conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) return [];

    // Return the last N messages
    return conversation.messages.slice(-maxMessages);
  } catch (error) {
    console.error("Error retrieving conversation history:", error);
    return [];
  }
}

/**
 * Clear conversation history
 */
export function clearConversationHistory(conversationId: string): void {
  if (typeof window === "undefined") return;

  try {
    const storedData = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!storedData) return;

    const conversations: ConversationHistory[] = JSON.parse(storedData);
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversationId
    );

    localStorage.setItem(
      CONVERSATION_STORAGE_KEY,
      JSON.stringify(updatedConversations)
    );
  } catch (error) {
    console.error("Error clearing conversation history:", error);
  }
}

/**
 * Get all conversation history summaries
 */
export function getAllConversations(): {
  id: string;
  preview: string;
  updatedAt: Date;
}[] {
  if (typeof window === "undefined") return [];

  try {
    const storedData = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!storedData) return [];

    const conversations: ConversationHistory[] = JSON.parse(storedData);

    return conversations.map((conv) => {
      // Get first user message as preview
      const userMessage = conv.messages.find((m) => m.role === "user");
      const preview = userMessage
        ? userMessage.content.substring(0, 30) +
          (userMessage.content.length > 30 ? "..." : "")
        : "New conversation";

      return {
        id: conv.id,
        preview,
        updatedAt: new Date(conv.updatedAt),
      };
    });
  } catch (error) {
    console.error("Error getting all conversations:", error);
    return [];
  }
}

/**
 * Generate a new conversation ID
 */
export function generateConversationId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
