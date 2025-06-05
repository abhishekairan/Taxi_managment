import { NextRequest, NextResponse } from "next/server";
import { getExpenseByDriverId } from "@/db/utilis";


export async function GET(req: NextRequest, {params}: {params: Promise<{driverId:string}>},) {
    const {driverId} = await params
    // console.log(driverId)
    const response = await getExpenseByDriverId(Number(driverId));
    // console.log("Response from trip/driver: ",response)
    if(response){
        return NextResponse.json({data:response},{status:200})
    }
    return NextResponse.json({data:response},{status: 400});
}
