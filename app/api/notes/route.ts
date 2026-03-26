import { NextResponse } from "next/server";
import { getNotesForConcept } from "@/api/concepts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conceptId = searchParams.get("conceptId");
  if (!conceptId) return NextResponse.json([]);

  const notes = await getNotesForConcept(conceptId);
  return NextResponse.json(notes);
}
