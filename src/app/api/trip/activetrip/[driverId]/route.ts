import { NextRequest, NextResponse } from "next/server";
import { getActiveTripByDriverId } from "@/db/utilis";


export async function GET(req: NextRequest, {params}: {params: Promise<{driverId:string}>},) {
    const {driverId} = await params
    // console.log(driverId)
    const response = await getActiveTripByDriverId(Number(driverId));
    // console.log("Response from trip/driver: ",response)
    return NextResponse.json(response,{status: 200});
}
