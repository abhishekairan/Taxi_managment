import { NextRequest, NextResponse } from "next/server";
import { getActiveTrips } from "@/db/utilis";

// export async function POST(req: NextRequest) {
//     const data = await db.select().from(trips).where(and(eq(trips.driver_id, Number(id)),eq(trips.isRunning,true))).get();
//     return NextResponse.json(data,{status: 200});
// }

export async function GET(req: NextRequest) {
    // console.log(driverId)
    const response = await getActiveTrips();
    console.log("Response",response)
    // console.log("Api data",data)
    return NextResponse.json(response,{status: 200});
}
