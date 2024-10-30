import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getMatchedKeywords } from "@/utils/getMatchedKeywords";
import { extractKeywords } from "@/utils/helper";

async function getUniqueTags(data: any) {
  const uniqueTagsMap = new Map();

  data.forEach((item: any) => {
    // Check if tags array is not empty
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag: any) => {
        // Only add the tag if its 'cat' value is not already in the map
        if (!uniqueTagsMap.has(tag.cat)) {
          uniqueTagsMap.set(tag.cat, tag);
        }
      });
    }
  });

  // Convert the map values to an array
  return Array.from(uniqueTagsMap.values());
}

export async function POST(req: Request) {
  const body: any = await req.json();

  const { queryString, issuesList = [] }: any = body;

  try {
    const issues = issuesList;

    const combinedTags = await getUniqueTags(issues);
    const tags = combinedTags.map((tag) => tag.key);

    const title = issuesList.map((item: any) => item.title).join(", ");
    const content = issuesList.map((item: any) => item.content).join(", ");

    let matchedKeywords: any = await getMatchedKeywords(
      title,
      content,
      tags,
      queryString
    );

    if (!matchedKeywords.length) {
      matchedKeywords = extractKeywords(title, content, tags, queryString);
    }

    return NextResponse.json(
      { success: true, message: "success", data: matchedKeywords || [] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to match keywords", error: error },
      { status: 500 }
    );
  }
}
