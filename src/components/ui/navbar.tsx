import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
            LibraTrack
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-500"
          >
            Dashboard
          </Link>
          <Link
            href="/books"
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-500"
          >
            Books
          </Link>
          <Link
            href="/checkouts"
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-500"
          >
            Checkouts
          </Link>
          <Link
            href="/assistant"
            className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-500"
          >
            AI Assistant
          </Link>
          <Button variant="default" size="sm" asChild>
            <Link href="/books/add">Add Book</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
