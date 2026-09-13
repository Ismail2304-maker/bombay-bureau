import { NextResponse } from "next/server";

const INDIAN_API_URL = "https://stock.indianapi.in";

async function fetchIndianAPI(endpoint: string, apiKey: string) {
  const response = await fetch(`${INDIAN_API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `${endpoint} failed with ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

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
    const [trending, nseMostActive, bseMostActive] =
      await Promise.all([
        fetchIndianAPI("/trending", apiKey),
        fetchIndianAPI("/NSE_most_active", apiKey),
        fetchIndianAPI("/BSE_most_active", apiKey),
      ]);

    return NextResponse.json({
      trending_stocks: trending?.trending_stocks || trending,
      nse_most_active: nseMostActive,
      bse_most_active: bseMostActive,
    });
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