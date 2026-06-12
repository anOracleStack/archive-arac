import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    chatAvailable: Boolean(process.env.OPENAI_API_KEY),
    buildDelivery: "coming_soon",
  });
}
