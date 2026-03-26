import { NextResponse } from "next/server";
import { getConcepts } from "@/api/concepts";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain") || undefined;

  const concepts = await getConcepts(domain);

  return NextResponse.json(concepts);
}
