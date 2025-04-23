"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import { SearchBooks } from "@/components/books/search-books";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  genre?: string;
  status: "AVAILABLE" | "CHECKED_OUT";
  publicationYear?: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async (search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL("/api/books", window.location.origin);
      if (search) {
        url.searchParams.append("search", search);
      }
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError("Error fetching books. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchBooks(term);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Book Collection</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Browse and manage your books
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBooks onSearch={handleSearch} initialSearchTerm={searchTerm} />
          <Button asChild>
            <Link href="/books/add">Add Book</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading books...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No books found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchTerm
              ? `No books match "${searchTerm}". Try a different search term.`
              : "Your library is empty. Start adding books to your collection."}
          </p>
          <Button asChild>
            <Link href="/books/add">Add Your First Book</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverImage={book.coverImage}
              genre={book.genre}
              status={book.status}
              publicationYear={book.publicationYear}
            />
          ))}
        </div>
      )}
    </div>
  );
}
