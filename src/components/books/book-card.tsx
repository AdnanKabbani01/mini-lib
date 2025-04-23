import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  genre?: string;
  status: "AVAILABLE" | "CHECKED_OUT";
  publicationYear?: number;
}

export function BookCard({
  id,
  title,
  author,
  coverImage,
  genre,
  status,
  publicationYear,
}: BookCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-[2/3] relative bg-slate-100 dark:bg-slate-800">
        {coverImage ? (
          <Image src={coverImage} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-slate-400 dark:text-slate-500 text-sm">
              No cover image
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "AVAILABLE"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
            }`}
          >
            {status === "AVAILABLE" ? "Available" : "Checked Out"}
          </span>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <div className="flex flex-col space-y-1 mt-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            by {author}
          </p>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
            {genre && <span>{genre}</span>}
            {publicationYear && <span>• {publicationYear}</span>}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/books/${id}`}>Details</Link>
          </Button>
          <Button
            variant={status === "AVAILABLE" ? "default" : "secondary"}
            size="sm"
            className="w-full"
            asChild
          >
            <Link
              href={
                status === "AVAILABLE"
                  ? `/books/${id}/checkout`
                  : `/books/${id}/return`
              }
            >
              {status === "AVAILABLE" ? "Checkout" : "Return"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
