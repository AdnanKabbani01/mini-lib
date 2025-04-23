import { NextRequest, NextResponse } from "next/server";
import { callOpenRouter, Message } from "@/lib/openrouter";
import {
  searchBooks,
  getBookDetails,
  getBookAvailability,
  getPopularBooks,
} from "@/lib/db-assistant";

// Define the system prompt with information about the library
const SYSTEM_PROMPT = `You are a helpful assistant for a library management system called LibraTrack. 
Your role is to help users find information about books in the library collection, check book availability, and provide recommendations.
You have access to the library database and can search for books by title, author, genre, or keywords.
Always respond in a friendly, helpful, and concise manner. If you don't know the answer to a question, say so honestly.

IMPORTANT: Maintain context from previous messages in the conversation. Reference previous questions and responses when appropriate.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, action, conversationHistory } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Handle different actions to retrieve data
    let contextData: any = {};
    if (action) {
      switch (action.type) {
        case "search":
          if (action.query) {
            const books = await searchBooks(action.query);
            contextData.searchResults = books;
          }
          break;
        case "details":
          if (action.bookId) {
            const book = await getBookDetails(action.bookId);
            if (book) {
              const availability = await getBookAvailability(action.bookId);
              contextData.bookDetails = { ...book, ...availability };
            }
          }
          break;
        case "popular":
          const popularBooks = await getPopularBooks();
          contextData.popularBooks = popularBooks;
          break;
      }
    }

    // Format the current messages for OpenRouter
    const formattedMessages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add conversation history if available (limited to last 10 messages)
    if (
      conversationHistory &&
      Array.isArray(conversationHistory) &&
      conversationHistory.length > 0
    ) {
      // Add a context message to inform the model about the history
      formattedMessages.push({
        role: "system",
        content: `Below are the previous messages in this conversation (most recent ${Math.min(
          conversationHistory.length,
          10
        )} messages):`,
      });

      // Format and add the conversation history
      const historyMessages = conversationHistory
        .slice(-10) // Get last 10 messages
        .map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

      formattedMessages.push(...historyMessages);

      // Add a separator
      formattedMessages.push({
        role: "system",
        content: "Current conversation:",
      });
    }

    // Add the current messages
    formattedMessages.push(
      ...messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))
    );

    // If we have context data, add it to the last user message
    if (Object.keys(contextData).length > 0) {
      const lastUserMessageIndex = formattedMessages
        .map((msg, i) => ({ role: msg.role, index: i }))
        .filter((msg) => msg.role === "user")
        .pop()?.index;

      if (lastUserMessageIndex !== undefined) {
        formattedMessages[
          lastUserMessageIndex
        ].content += `\n\nContext information (not visible to user):\n${JSON.stringify(
          contextData,
          null,
          2
        )}`;
      }
    }

    // Call OpenRouter API
    const assistantResponse = await callOpenRouter(formattedMessages);

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "The assistant API is running" });
}
