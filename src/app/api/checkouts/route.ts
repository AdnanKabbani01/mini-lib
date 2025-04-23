import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const checkouts = await prisma.checkout.findMany({
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
      },
      orderBy: [
        {
          returnDate: "asc", // null values first (active checkouts)
        },
        {
          dueDate: "asc", // earliest due date first
        },
      ],
    });

    return NextResponse.json(checkouts);
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkouts" },
      { status: 500 }
    );
  }
}
