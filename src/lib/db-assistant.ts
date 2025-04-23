import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface BookData {
  id: string;
  title: string;
  author: string;
  isbn?: string | null;
  genre?: string | null;
  description?: string | null;
  status: string;
  publicationYear?: number | null;
}

export async function searchBooks(query: string): Promise<BookData[]> {
  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
        { genre: { contains: query, mode: "insensitive" } },
        { isbn: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5, // Limit results to prevent overwhelming responses
  });

  return books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    description: book.description,
    status: book.status,
    publicationYear: book.publicationYear,
  }));
}

export async function getBookDetails(bookId: string): Promise<BookData | null> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) return null;

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    description: book.description,
    status: book.status,
    publicationYear: book.publicationYear,
  };
}

export async function getBookAvailability(
  bookId: string
): Promise<{ available: boolean; dueDate?: Date | null }> {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      checkouts: {
        where: { returnDate: null },
        orderBy: { checkoutDate: "desc" },
        take: 1,
      },
    },
  });

  if (!book) {
    throw new Error("Book not found");
  }

  const isAvailable = book.status === "AVAILABLE";
  const activeCheckout = book.checkouts[0];

  return {
    available: isAvailable,
    dueDate: activeCheckout?.dueDate || null,
  };
}

export async function getPopularBooks(limit: number = 5): Promise<BookData[]> {
  // Get books with the most checkouts
  const books = await prisma.book.findMany({
    include: {
      _count: {
        select: { checkouts: true },
      },
    },
    orderBy: {
      checkouts: {
        _count: "desc",
      },
    },
    take: limit,
  });

  return books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    genre: book.genre,
    description: book.description,
    status: book.status,
    publicationYear: book.publicationYear,
  }));
}
