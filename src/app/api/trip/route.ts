import { NextRequest, NextResponse } from "next/server";
import { createTrip, getAllDrivers, getAllTrips } from "@/db/utilis";

// PUT request to create a trip
export async function PUT(req: NextRequest) {
    const body = await req.json();
    delete body.data.id;
    const data = await createTrip(body.data);
    return NextResponse.json(data,{status: 200});
}

export async function GET(req: NextRequest) {
    const trips = await getAllTrips();
    const drivers = await getAllDrivers();
    const data = trips?.map((trip) => {
        const driver = drivers?.find((d) => d.id === trip.driver_id);
        return {
            ...trip,
            driver_id: driver || null
        };
    })
    return NextResponse.json(data,{status: 200});
}