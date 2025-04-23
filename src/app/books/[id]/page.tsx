"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  genre?: string;
  description?: string;
  coverImage?: string;
  pageCount?: number;
  publicationYear?: number;
  status: "AVAILABLE" | "CHECKED_OUT";
  createdAt: string;
  updatedAt: string;
  checkouts: Checkout[];
}

interface Checkout {
  id: string;
  borrowerName: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        const errorMessage =
          errorData.error || `Failed to delete book (${response.status})`;
        throw new Error(errorMessage);
      }

      router.push("/books");
      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete book. Please try again."
      );
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/books">Back to Books</Link>
            </Button>
            <Button variant="default" onClick={() => setError(null)}>
              Try Again
            </Button>
          </div>
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

  const latestCheckout = book.checkouts?.[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/books"
          className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Books
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/books/${book.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4 bg-slate-50 dark:bg-slate-900 p-6">
            <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden mb-6">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-400 dark:text-slate-500 text-sm">
                    No cover image
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Status
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                    book.status === "AVAILABLE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                  }`}
                >
                  {book.status === "AVAILABLE" ? "Available" : "Checked Out"}
                </span>
              </div>

              {book.status === "AVAILABLE" ? (
                <Button className="w-full" asChild>
                  <Link href={`/books/${book.id}/checkout`}>Checkout Book</Link>
                </Button>
              ) : (
                <Button className="w-full" variant="secondary" asChild>
                  <Link href={`/books/${book.id}/return`}>Return Book</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="md:w-2/3 lg:w-3/4 p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-6">
              by {book.author}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {book.isbn && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    ISBN
                  </h3>
                  <p>{book.isbn}</p>
                </div>
              )}

              {book.publisher && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Publisher
                  </h3>
                  <p>{book.publisher}</p>
                </div>
              )}

              {book.genre && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Genre
                  </h3>
                  <p>{book.genre}</p>
                </div>
              )}

              {book.publicationYear && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Publication Year
                  </h3>
                  <p>{book.publicationYear}</p>
                </div>
              )}

              {book.pageCount && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Page Count
                  </h3>
                  <p>{book.pageCount}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Added to Library
                </h3>
                <p>{formatDate(book.createdAt)}</p>
              </div>
            </div>

            {book.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {book.description}
                </p>
              </div>
            )}

            {book.checkouts && book.checkouts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Checkout History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium">
                          Borrower
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Checkout Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Due Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Return Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {book.checkouts.map((checkout) => (
                        <tr
                          key={checkout.id}
                          className="border-b border-slate-200 dark:border-slate-700"
                        >
                          <td className="py-3 px-4">{checkout.borrowerName}</td>
                          <td className="py-3 px-4">
                            {formatDate(checkout.checkoutDate)}
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(checkout.dueDate)}
                          </td>
                          <td className="py-3 px-4">
                            {checkout.returnDate
                              ? formatDate(checkout.returnDate)
                              : "Not returned"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
