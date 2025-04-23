import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params: { id } }: RouteParams
) {
  try {
    const body = await request.json();
    const { borrowerName, dueDate } = body;

    // First, check if the book exists and is available
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.status === "CHECKED_OUT") {
      return NextResponse.json(
        { error: "Book is already checked out" },
        { status: 400 }
      );
    }

    // Create a transaction to update both book status and create checkout record
    const result = await prisma.$transaction([
      // Update book status
      prisma.book.update({
        where: {
          id,
        },
        data: {
          status: "CHECKED_OUT",
        },
      }),
      // Create checkout record
      prisma.checkout.create({
        data: {
          bookId: id,
          borrowerName,
          dueDate: new Date(dueDate),
        },
      }),
    ]);

    return NextResponse.json(result[1], { status: 201 });
  } catch (error) {
    console.error("Error checking out book:", error);
    return NextResponse.json(
      { error: "Failed to checkout book" },
      { status: 500 }
    );
  }
}
