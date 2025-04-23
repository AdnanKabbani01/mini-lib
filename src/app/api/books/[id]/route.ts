import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params: { id } }: RouteParams
) {
  try {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      include: {
        checkouts: {
          orderBy: {
            checkoutDate: "desc",
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params: { id } }: RouteParams
) {
  try {
    const body = await request.json();

    const book = await prisma.book.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params: { id } }: RouteParams
) {
  try {
    // First check if the book exists
    const book = await prisma.book.findUnique({
      where: { id },
      include: { checkouts: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if there are active checkouts (not returned)
    const activeCheckouts = book.checkouts.filter((c) => c.returnDate === null);
    if (activeCheckouts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete book while it is checked out" },
        { status: 400 }
      );
    }

    // Delete related checkouts first
    if (book.checkouts.length > 0) {
      await prisma.checkout.deleteMany({
        where: { bookId: id },
      });
    }

    // Now delete the book
    await prisma.book.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting book:", error);

    // Check if this is a known Prisma error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to delete book: ${errorMessage}` },
      { status: 500 }
    );
  }
}
