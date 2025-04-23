"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import {
  saveMessage,
  getConversationHistory,
  clearConversationHistory,
  generateConversationId,
  StoredMessage,
} from "@/lib/message-storage";
import { ArchiveX } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantProps {
  initialPrompt?: string;
  darkMode?: boolean;
}

export function Assistant({ initialPrompt, darkMode = true }: AssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation ID and load history
  useEffect(() => {
    const newConversationId = generateConversationId();
    setConversationId(newConversationId);

    // Add initial greeting message when component mounts
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your library assistant powered by Google Gemini. How can I help you find books or information today?",
      },
    ]);

    // Save initial greeting to history
    saveMessage(newConversationId, {
      role: "assistant",
      content:
        "Hello! I'm your library assistant powered by Google Gemini. How can I help you find books or information today?",
      timestamp: new Date(),
    });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    // Update UI with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message to history
    saveMessage(conversationId, {
      role: "user",
      content: input,
      timestamp: new Date(),
    });

    try {
      // Analyze the message to determine if we need to search books
      const action = determineAction(input);

      // Get conversation history
      const conversationHistory = getConversationHistory(conversationId);

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          action,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from assistant");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      // Update UI with assistant message
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to history
      saveMessage(conversationId, {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error communicating with assistant:", error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again later.",
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Save error message to history
      saveMessage(conversationId, {
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again later.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    // Clear the UI messages
    setMessages([
      {
        role: "assistant",
        content:
          "The conversation has been cleared. How else can I help you today?",
      },
    ]);

    // Clear conversation history
    clearConversationHistory(conversationId);

    // Generate a new conversation ID
    const newConversationId = generateConversationId();
    setConversationId(newConversationId);

    // Save the new initial message
    saveMessage(newConversationId, {
      role: "assistant",
      content:
        "The conversation has been cleared. How else can I help you today?",
      timestamp: new Date(),
    });
  };

  // Determine what action to take based on user input
  const determineAction = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Check for search intent
    const searchTerms = extractSearchTerms(input);
    if (searchTerms) {
      return {
        type: "search",
        query: searchTerms,
      };
    }

    // Check for popularity or recommendation requests
    if (
      lowerInput.includes("popular") ||
      lowerInput.includes("recommend") ||
      lowerInput.includes("best seller") ||
      lowerInput.includes("bestseller") ||
      lowerInput.includes("most read") ||
      lowerInput.includes("top books")
    ) {
      return {
        type: "popular",
      };
    }

    // Check for specific book requests
    const bookTitleMatch = lowerInput.match(
      /(?:details|availability|about|info|tell me about|do you have)(.*?)(book|novel|title)(.*)/i
    );
    if (bookTitleMatch && bookTitleMatch[3]?.trim()) {
      const potentialTitle = bookTitleMatch[3].trim();
      if (potentialTitle.length > 2) {
        return {
          type: "search",
          query: potentialTitle,
        };
      }
    }

    return null;
  };

  // Extract potential search terms from user input
  const extractSearchTerms = (input: string): string | null => {
    const lowerInput = input.toLowerCase();

    // Common phrases for book searches
    const searchPhrases = [
      "find books about",
      "find books on",
      "find book by",
      "search for",
      "looking for",
      "books by",
      "book by",
      "novels by",
      "novel by",
      "books about",
      "book about",
      "books on",
      "book on",
      "find",
      "search",
    ];

    for (const phrase of searchPhrases) {
      if (lowerInput.includes(phrase)) {
        const index = lowerInput.indexOf(phrase);
        const searchTerm = input.slice(index + phrase.length).trim();
        if (searchTerm && searchTerm.length > 2) {
          return searchTerm;
        }
      }
    }

    // Genre detection
    const genres = [
      "fiction",
      "non-fiction",
      "science fiction",
      "sci-fi",
      "fantasy",
      "mystery",
      "thriller",
      "romance",
      "horror",
      "biography",
      "autobiography",
      "history",
      "poetry",
      "drama",
      "adventure",
    ];

    for (const genre of genres) {
      if (lowerInput.includes(genre)) {
        return genre;
      }
    }

    return null;
  };

  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const headerBgColor = darkMode ? "bg-gray-800" : "bg-slate-100";
  const headerTextColor = darkMode ? "text-white" : "text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-slate-200";
  const inputBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const inputTextColor = darkMode ? "text-white" : "text-gray-800";
  const footerBgColor = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <div
      className={`flex flex-col h-[500px] w-full max-w-2xl mx-auto border rounded-xl shadow-lg overflow-hidden ${borderColor} ${bgColor}`}
    >
      <div
        className={`p-3 ${headerBgColor} border-b ${borderColor} flex items-center justify-between`}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <h2 className={`text-lg font-semibold ${headerTextColor}`}>
            Library Assistant (Google Gemini)
          </h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className={`p-1 h-8 w-8 rounded-full hover:bg-gray-700 focus:ring-0 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArchiveX className="h-4 w-4" />
          <span className="sr-only">Clear chat</span>
        </Button>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${bgColor}`}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-[80%] p-3 ${
                message.role === "user"
                  ? "bg-emerald-600 text-white"
                  : darkMode
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-gray-100 text-gray-800"
              } shadow-md rounded-2xl ${
                message.role === "user" ? "rounded-br-none" : "rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card
              className={`max-w-[80%] p-3 ${
                darkMode
                  ? "bg-gray-800 text-gray-300 border border-gray-700"
                  : "bg-gray-100"
              } rounded-2xl rounded-bl-none animate-pulse`}
            >
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={`p-3 border-t ${borderColor} ${footerBgColor}`}>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about books..."
            disabled={isLoading}
            className={`flex-1 border ${borderColor} ${inputBgColor} ${inputTextColor} placeholder:text-gray-500`}
          />
          <Button
            type="submit"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
