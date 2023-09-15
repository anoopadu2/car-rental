import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
connectDB();

export async function GET(request: any) {
  try {
    await validateTokenAndGetUserId(request);
    const users = await User.find({});
    return NextResponse.json({ data: users });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, error },
      { status: 400 }
    );
  }
}
