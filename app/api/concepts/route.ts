import { NextResponse } from "next/server";
import { getConcepts } from "@/lib/services/conceptsService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain") || "All";
    
    const concepts = await getConcepts(domain);
    
    return NextResponse.json(concepts);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch concepts" },
      { status: 500 }
    );
  }
}