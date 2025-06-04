import { NextRequest, NextResponse } from "next/server";
import { getActiveTrips, getDriver } from "@/db/utilis";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try{
        console.log("Fetching active trips...");
        const response = await getActiveTrips();
        const data = await Promise.all(response?.map( async (trip) => {
            const driver = await getDriver(trip.driver_id);
            return {
                ...trip,
            driver_id: driver || undefined
        };
    }))
    if(!data || data.length < 1) {
        return NextResponse.json("No active trips found", { status: 404 });
    }
    return NextResponse.json(data,{status: 200});
    } catch (error) {
        console.error("Error fetching active trips:", error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}
