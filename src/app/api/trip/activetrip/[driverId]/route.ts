import { NextRequest, NextResponse } from "next/server";
import { getActiveTripByDriverId, updateTrip } from "@/db/utilis";

// export async function POST(req: NextRequest, {params}: {params: Promise<{id:string}>},) {
//     const {id} = await params
//     const data = await db.select().from(trips).where(and(eq(trips.driver_id, Number(id)),eq(trips.isRunning,true))).get();
//     return NextResponse.json(data,{status: 200});
// }

export async function GET(req: NextRequest, {params}: {params: Promise<{driverId:string}>},) {
    const {driverId} = await params
    // console.log(driverId)
    const response = await getActiveTripByDriverId(Number(driverId));
    // console.log("Response",response)
    // console.log("Api data",data)
    return NextResponse.json(response,{status: 200});
}
