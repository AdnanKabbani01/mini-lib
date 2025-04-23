const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const defaultBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    publisher: "HarperCollins",
    genre: "Fiction",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    pageCount: 336,
    publicationYear: 1960,
    status: "AVAILABLE",
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    publisher: "Signet Classics",
    genre: "Dystopian",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
    pageCount: 328,
    publicationYear: 1949,
    status: "AVAILABLE",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    publisher: "Scribner",
    genre: "Fiction",
    description:
      "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    pageCount: 180,
    publicationYear: 1925,
    status: "AVAILABLE",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    isbn: "9780590353427",
    publisher: "Scholastic",
    genre: "Fantasy",
    description:
      "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
    pageCount: 309,
    publicationYear: 1997,
    status: "AVAILABLE",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780618260300",
    publisher: "Houghton Mifflin",
    genre: "Fantasy",
    description:
      "A glorious account of a magnificent adventure, filled with suspense and seasoned with a quiet humor that is irresistible.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    pageCount: 366,
    publicationYear: 1937,
    status: "AVAILABLE",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    publisher: "Penguin Classics",
    genre: "Classic",
    description:
      "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
    pageCount: 435,
    publicationYear: 1813,
    status: "AVAILABLE",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    publisher: "Little, Brown and Company",
    genre: "Fiction",
    description:
      "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
    pageCount: 277,
    publicationYear: 1951,
    status: "AVAILABLE",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    publisher: "HarperOne",
    genre: "Fiction",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    pageCount: 197,
    publicationYear: 1988,
    status: "AVAILABLE",
  },
];

async function main() {
  try {
    console.log("Start seeding...");

    // Clean existing data
    await prisma.checkout.deleteMany();
    console.log("Deleted all checkouts");

    await prisma.book.deleteMany();
    console.log("Deleted all books");

    // Add books
    for (const book of defaultBooks) {
      const createdBook = await prisma.book.create({
        data: book,
      });
      console.log(`Created book with ID: ${createdBook.id}`);
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
