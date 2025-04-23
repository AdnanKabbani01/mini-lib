"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/books/checkout-form";

interface Book {
  id: string;
  title: string;
  author: string;
  status: "AVAILABLE" | "CHECKED_OUT";
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise with React.use()
  const { id } = use(params);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Book not found");
          }
          throw new Error("Failed to fetch book");
        }
        const data = await response.json();

        if (data.status !== "AVAILABLE") {
          setError("This book is already checked out and cannot be borrowed.");
        }

        setBook(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching book details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const onSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/books/${id}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to checkout book");
      }

      router.push(`/books/${id}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to checkout book. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/books">Back to Books</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Book not found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/books">Back to Books</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Checkout Book</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {book.title} by {book.author}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/books/${id}`}>Cancel</Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {book.status !== "AVAILABLE" ? (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-md mb-6">
          <p>This book is already checked out and cannot be borrowed.</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href={`/books/${id}`}>Back to Book Details</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <CheckoutForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
}
