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
    // First, check if the book exists and is checked out
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      include: {
        checkouts: {
          orderBy: {
            checkoutDate: "desc",
          },
          take: 1,
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.status !== "CHECKED_OUT") {
      return NextResponse.json(
        { error: "Book is not checked out" },
        { status: 400 }
      );
    }

    if (book.checkouts.length === 0) {
      return NextResponse.json(
        { error: "No checkout record found" },
        { status: 400 }
      );
    }

    const latestCheckout = book.checkouts[0];

    // Create a transaction to update both book status and update checkout record
    const result = await prisma.$transaction([
      // Update book status
      prisma.book.update({
        where: {
          id,
        },
        data: {
          status: "AVAILABLE",
        },
      }),
      // Update checkout record with return date
      prisma.checkout.update({
        where: {
          id: latestCheckout.id,
        },
        data: {
          returnDate: new Date(),
        },
      }),
    ]);

    return NextResponse.json(result[1]);
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json(
      { error: "Failed to return book" },
      { status: 500 }
    );
  }
}
