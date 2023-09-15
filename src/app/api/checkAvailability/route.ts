import Booking from "@/models/bookingModel";
import { connectDB } from "@/config/dbConfig";
import { NextResponse } from "next/server";
import { validateTokenAndGetUserId } from "@/helpers/tokenValidation";

connectDB();

export async function POST(request: any) {
  try {
    let slotAvailable = true;
    const { fromSlot, toSlot, car } = await request.json();

    // check if the car is available in the given time slot
    const bookings = await Booking.find({
      car: car,
      status: "approved",
      $or: [
        { fromSlot: { $gte: fromSlot, $lte: toSlot } },
        { toSlot: { $gte: fromSlot, $lte: toSlot } },
        { fromSlot: { $lte: fromSlot }, toSlot: { $gte: toSlot } },
        {
          toSlot: { $gte: fromSlot, $lte: toSlot },
          fromSlot: { $lte: fromSlot },
        },
      ],
    });

    if (bookings.length > 0) {
      slotAvailable = false;
    }

    return NextResponse.json({ success: slotAvailable, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
