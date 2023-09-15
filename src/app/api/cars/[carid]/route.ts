import { connectDB } from "@/config/dbConfig";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";
import Car from "@/models/carModel";
import { NextResponse } from "next/server";
connectDB();

// get car by id
export async function GET(request: any, { params }: any) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const car = await Car.findById(params.carid);
    return NextResponse.json({ data: car });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// edit car
export async function PUT(request: any) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    const reqBody = await request.json();
    await Car.findByIdAndUpdate(reqBody._id, reqBody);
    return NextResponse.json({ message: "Car updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// delete car
export async function DELETE(request: any, { params }: any) {
  try {
    const userId = await validateTokenAndGetUserId(request);
    await Car.findByIdAndDelete(params.carid);
    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}