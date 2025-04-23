"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Checkout {
  id: string;
  bookId: string;
  borrowerName: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  book: {
    id: string;
    title: string;
    author: string;
  };
}

export default function CheckoutsPage() {
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "returned">("active");

  const fetchCheckouts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkouts");
      if (!response.ok) {
        throw new Error("Failed to fetch checkouts");
      }
      const data = await response.json();
      setCheckouts(data);
    } catch (err) {
      setError("Error fetching checkouts. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const filteredCheckouts = checkouts.filter((checkout) => {
    if (filter === "all") return true;
    if (filter === "active") return checkout.returnDate === null;
    if (filter === "returned") return checkout.returnDate !== null;
    return true;
  });

  // Group active checkouts by whether they're overdue
  const today = new Date();
  const activeCheckouts = filteredCheckouts.filter(
    (checkout) => checkout.returnDate === null
  );
  const overdueCheckouts = activeCheckouts.filter(
    (checkout) => new Date(checkout.dueDate) < today
  );
  const currentCheckouts = activeCheckouts.filter(
    (checkout) => new Date(checkout.dueDate) >= today
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Checkout History</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track borrowed books and due dates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "returned" ? "default" : "outline"}
            onClick={() => setFilter("returned")}
          >
            Returned
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Loading checkouts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : filteredCheckouts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No checkouts found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {filter === "active"
              ? "No books are currently checked out."
              : filter === "returned"
              ? "No books have been returned yet."
              : "No checkout history available."}
          </p>
          <Button asChild>
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {filter === "active" && overdueCheckouts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-500">
                Overdue Books
              </h2>
              <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900">
                        <th className="py-3 px-4 text-left font-medium">
                          Book
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Borrower
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Checkout Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Due Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueCheckouts.map((checkout) => (
                        <tr
                          key={checkout.id}
                          className="border-t border-slate-200 dark:border-slate-800"
                        >
                          <td className="py-3 px-4">
                            <Link
                              href={`/books/${checkout.bookId}`}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              {checkout.book.title}
                            </Link>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              by {checkout.book.author}
                            </div>
                          </td>
                          <td className="py-3 px-4">{checkout.borrowerName}</td>
                          <td className="py-3 px-4">
                            {formatDate(checkout.checkoutDate)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-red-600 dark:text-red-500 font-medium">
                              {formatDate(checkout.dueDate)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-500">
                              Overdue
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/books/${checkout.bookId}/return`}>
                                Return
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {filter === "active" && currentCheckouts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Checkouts</h2>
              <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900">
                        <th className="py-3 px-4 text-left font-medium">
                          Book
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Borrower
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Checkout Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Due Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCheckouts.map((checkout) => (
                        <tr
                          key={checkout.id}
                          className="border-t border-slate-200 dark:border-slate-800"
                        >
                          <td className="py-3 px-4">
                            <Link
                              href={`/books/${checkout.bookId}`}
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              {checkout.book.title}
                            </Link>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              by {checkout.book.author}
                            </div>
                          </td>
                          <td className="py-3 px-4">{checkout.borrowerName}</td>
                          <td className="py-3 px-4">
                            {formatDate(checkout.checkoutDate)}
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(checkout.dueDate)}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/books/${checkout.bookId}/return`}>
                                Return
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(filter === "all" || filter === "returned") && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {filter === "all" ? "Returned Books" : "Return History"}
              </h2>
              <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900">
                        <th className="py-3 px-4 text-left font-medium">
                          Book
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Borrower
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Checkout Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Due Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium">
                          Return Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCheckouts
                        .filter((checkout) => checkout.returnDate !== null)
                        .map((checkout) => (
                          <tr
                            key={checkout.id}
                            className="border-t border-slate-200 dark:border-slate-800"
                          >
                            <td className="py-3 px-4">
                              <Link
                                href={`/books/${checkout.bookId}`}
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              >
                                {checkout.book.title}
                              </Link>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                by {checkout.book.author}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {checkout.borrowerName}
                            </td>
                            <td className="py-3 px-4">
                              {formatDate(checkout.checkoutDate)}
                            </td>
                            <td className="py-3 px-4">
                              {formatDate(checkout.dueDate)}
                            </td>
                            <td className="py-3 px-4">
                              {formatDate(checkout.returnDate!)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
