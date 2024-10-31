// app/api/createIssue/route.ts
"use server";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// Define the expected request body structure
type IssueData = {
  title: string;
  content: string;
  tags?: Array<{ cat: string; key: string }> | null;
  status?: any;
  assignee?: Array<any>;
  priority?: any | null;
  project?: any | null;
  dueDate?: string | null;
};

export async function POST(req: Request) {
  const body: IssueData = await req.json();

  try {
    // Save data to the database
    const issue = await prisma.issueList.create({
      data: {
        title: body.title,
        content: body.content,
        status: body.status
          ? {
              create: {
                cat: body.status.cat,
                key: body.status.key,
              },
            }
          : undefined,
        assignee: body.assignee?.length
          ? {
              create: body.assignee.map((a) => ({
                cat: a.cat,
                key: a.key,
              })),
            }
          : undefined,
        priority: body.priority
          ? {
              create: {
                cat: body.priority.cat,
                key: body.priority.key,
              },
            }
          : undefined,
        tags: {
          create:
            body.tags?.map((t) => ({
              cat: t.cat,
              key: t.key,
            })) || [], // Using an empty array if no tags provided
        },
        project: body.project
          ? {
              create: {
                cat: body.project.cat,
                key: body.project.key,
              },
            }
          : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });

    return NextResponse.json(
      { success: true, message: "success", data: issue },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to save issue:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save issue", error: error },
      { status: 500 }
    );
  }
}
