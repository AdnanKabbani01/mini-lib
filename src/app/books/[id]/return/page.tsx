"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  status: "AVAILABLE" | "CHECKED_OUT";
  checkouts: Checkout[];
}

interface Checkout {
  id: string;
  borrowerName: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
}

export default function ReturnBookPage({ params }: { params: { id: string } }) {
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

        if (data.status !== "CHECKED_OUT") {
          setError("This book is not checked out and cannot be returned.");
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

  const handleReturn = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/books/${id}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to return book");
      }

      router.push(`/books/${id}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to return book. Please try again.");
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

  const latestCheckout = book.checkouts[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Return Book</h1>
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

      {book.status !== "CHECKED_OUT" ? (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-md mb-6">
          <p>This book is not checked out and cannot be returned.</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href={`/books/${id}`}>Back to Book Details</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Checkout Information
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Borrower
                  </dt>
                  <dd>{latestCheckout.borrowerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Checkout Date
                  </dt>
                  <dd>{formatDate(latestCheckout.checkoutDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Due Date
                  </dt>
                  <dd>
                    {formatDate(latestCheckout.dueDate)}
                    {new Date() > new Date(latestCheckout.dueDate) && (
                      <span className="text-red-500 ml-2">(Overdue)</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleReturn} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Return"}
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click the button above to confirm that the book has been
                returned.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
