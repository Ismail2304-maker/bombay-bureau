import { NextResponse } from "next/server";

const INDIAN_API_URL = "https://stock.indianapi.in";

export async function GET() {
  const apiKey = process.env.INDIAN_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Indian Stock Market API key is not configured.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${INDIAN_API_URL}/trending`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Indian Stock Market API request failed.",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Markets API error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch market data.",
      },
      { status: 500 }
    );
  }
}
