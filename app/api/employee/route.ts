import { NextRequest, NextResponse } from "next/server";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

type GasError = {
  error?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  if (!GAS_URL) {
    return NextResponse.json(
      { error: "GAS_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as GasError;

    if (!response.ok || result.error) {
      return NextResponse.json(
        {
          error: result.message || result.error || "Failed to process request",
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
