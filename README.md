# LibraTrack - Modern Book Management System

LibraTrack is a comprehensive book management system that allows users to track their book collection, manage checkouts, and keep a history of borrowed books. Built with modern web technologies, it provides a beautiful and intuitive user interface for all your book management needs.

## Features

- **Book Management**: Add, edit, and delete books with comprehensive metadata
- **Checkout System**: Track borrowed books with due dates and borrower information
- **Return Process**: Simple process for returning books
- **Search & Filter**: Easily find books by title, author, or other fields
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Dark Mode Support**: Elegant interface in both light and dark modes

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Database**: SQLite with Prisma ORM
- **API**: RESTful API endpoints with Next.js API routes

## Getting Started

### Prerequisites

- Node.js 18 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/libratrack.git
cd libratrack
```

2. Install dependencies:

```bash
npm install
```

3. Initialize the database:

```bash
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses two main models:

- **Book**: Stores book information (title, author, ISBN, etc.)
- **Checkout**: Tracks checkout history with borrower details and dates

## API Endpoints

- `GET /api/books` - List all books
- `POST /api/books` - Add a new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `POST /api/books/:id/checkout` - Checkout a book
- `POST /api/books/:id/return` - Return a book
- `GET /api/checkouts` - List all checkouts