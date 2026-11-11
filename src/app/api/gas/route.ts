import { NextRequest, NextResponse } from "next/server";

const DEFAULT_GAS_URL =
  process.env.GAS_EXEC_URL ||
  "https://script.google.com/macros/s/AKfycbxHv0P-UIPghtjjUzMiu0Bdi7WqvtNlDmEQmVaOnS1dPQAgdZNZV7piFks72p1GJDz9/exec";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const gasResponse = await fetch(DEFAULT_GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(body || {}),
      redirect: "follow",
    });

    const rawText = await gasResponse.text();

    try {
      const parsedData = JSON.parse(rawText);
      return NextResponse.json(parsedData, { status: 200 });
    } catch {
      // Clean HTML error response if GAS returned an error page
      const cleanText = rawText
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const errorSnippet = cleanText.length > 250 ? cleanText.slice(0, 250) + "..." : cleanText;

      return NextResponse.json(
        {
          success: false,
          message: "Google Apps Script Error: " + (errorSnippet || "Server mengembalikan HTML, bukan JSON."),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        success: false,
        message: "Gagal terhubung ke Google Apps Script: " + (err?.message || "Unknown proxy error"),
      },
      { status: 500 }
    );
  }
}

