import { NextResponse } from "next/server";
import { views } from "@/lib/views";

function reply(count: number | null) {
  return count === null
    ? NextResponse.json({ count: null }, { status: 404 })
    : NextResponse.json({ count });
}

/** Current total, without counting. */
export async function GET() {
  return reply(await views("get"));
}

/** Counts one visit and returns the new total. */
export async function POST() {
  return reply(await views("incr"));
}
