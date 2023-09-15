import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { data: null, message: "User has been logged out successfully" },
      { status: 200 }
    );

    // Clear cookie token
    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { data: null, message: error.message },
      { status: 500 }
    );
  }
}
