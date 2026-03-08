import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://miki.shpee.cc";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const affiliate_id = request.nextUrl.searchParams.get("affiliate_id");

  if (!url || !affiliate_id) {
    return NextResponse.json(
      { success: false, error: "Thiếu url hoặc affiliate_id" },
      { status: 400 }
    );
  }

  const apiUrl = new URL(API_BASE);
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("affiliate_id", affiliate_id);

  try {
    const res = await fetch(apiUrl.toString(), {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "x-requested-with": "XMLHttpRequest",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    );
  }
}
