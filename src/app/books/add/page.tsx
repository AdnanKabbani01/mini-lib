"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookForm } from "@/components/books/book-form";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      router.push("/books");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <Button variant="outline" asChild>
            <Link href="/books">Cancel</Link>
          </Button>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Fill in the book details below
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <BookForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
