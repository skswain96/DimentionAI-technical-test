import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  console.log("here 2", process.env.NEXT_PUBLIC_TEST);

  try {
    const issues = await prisma.issueList.findMany({
      include: {
        tags: true, // Include related tags
      },
    });

    return NextResponse.json(
      { success: true, message: "success", data: issues },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch list", error: error },
      { status: 500 }
    );
  }
}
