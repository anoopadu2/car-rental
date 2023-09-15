import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connectDB();

export async function GET(request: any) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const user = await User.findById(userId).select("-password");
    return NextResponse.json(
      {
        data: user,
        message: "Successfully fetched current user.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
