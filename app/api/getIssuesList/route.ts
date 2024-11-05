import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
    console.error("error", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch list", error: error },
      { status: 500 }
    );
  }
}
