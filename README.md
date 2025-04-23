# LibraTrack - Modern Book Management System

LibraTrack is a comprehensive book management system that allows users to track their book collection, manage checkouts, and keep a history of borrowed books. Built with modern web technologies, it provides a beautiful and intuitive user interface for all your book management needs.

## Features

- **Book Management**: Add, edit, and delete books with comprehensive metadata
- **Checkout System**: Track borrowed books with due dates and borrower information
- **Return Process**: Simple process for returning books
- **Search & Filter**: Easily find books by title, author, or other fields
- **AI Assistant**: Intelligent assistant powered by Google Gemini to answer queries about the library collection
- **SQLite Database**: Light, portable database with Prisma ORM for data persistence
- **Book Metadata**: Track detailed information including genre, publication year, page count, and cover images
- **Availability Status**: Real-time book status (available/checked out)
- **Popular Books Tracking**: System tracks and displays most frequently borrowed books
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Dark Mode Support**: Elegant interface in both light and dark modes

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Database**: SQLite with Prisma ORM
- **API**: RESTful API endpoints with Next.js API routes
- **AI Integration**: Google Gemini AI via OpenRouter API
- **State Management**: Context API for state management

## Getting Started

### Prerequisites

- Node.js 18 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AdnanKabbani01/mini-lib.git
cd libratrack
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with the following variables:

```
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Initialize the database:

```bash
npx prisma db push
```

5. Seed the database with sample data (optional):

```bash
npx prisma db seed
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following models:

- **Book**: Stores comprehensive book information:

  - Basic details: title, author, ISBN
  - Additional metadata: publisher, genre, description
  - Format details: page count, publication year, cover image
  - Status tracking: available or checked out

- **Checkout**: Tracks checkout history with:
  - Borrower information
  - Checkout date
  - Due date
  - Return date (if returned)

## API Endpoints

### Books

- `GET /api/books` - List all books
- `POST /api/books` - Add a new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `POST /api/books/:id/checkout` - Checkout a book
- `POST /api/books/:id/return` - Return a book

### Checkouts

- `GET /api/checkouts` - List all checkouts

### AI Assistant

- `POST /api/assistant` - Send queries to the AI assistant
- `GET /api/assistant` - Check assistant status

## AI Assistant Features

The built-in AI assistant can:

- Search for books by title, author, or genre
- Provide book recommendations
- Check book availability
- Answer questions about the library collection
- Maintain conversation context for natural interactions
