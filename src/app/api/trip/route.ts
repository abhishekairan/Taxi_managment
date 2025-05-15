import { NextRequest, NextResponse } from "next/server";
import { createTrip, getAllTrips } from "@/db/utilis";

// PUT request to create a trip
export async function PUT(req: NextRequest) {
    const body = await req.json();
    delete body.data.id;
    const data = await createTrip(body.data);
    return NextResponse.json(data,{status: 200});
}

export async function GET(req: NextRequest) {
    const data = await getAllTrips();
    return NextResponse.json(data,{status: 200});
}