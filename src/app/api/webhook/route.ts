import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { BOLD_COMMERCE_SHARED_SECRET } = process.env;

  if (!BOLD_COMMERCE_SHARED_SECRET) {
    return new Response("Shared secret not found", { status: 500 });
  }

  try {
    const body = await req.json()
  } catch (error) {
    return new Response("Internal webhook error", { status: 401 });
  }

  return NextResponse.json({ message: "success" });
}
