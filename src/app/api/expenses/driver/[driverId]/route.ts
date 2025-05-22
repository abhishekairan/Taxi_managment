import { NextRequest, NextResponse } from "next/server";
import { getActiveTripByDriverId, getExpense, getExpenseByDriverId } from "@/db/utilis";


export async function GET(req: NextRequest, {params}: {params: Promise<{driverId:string}>},) {
    const {driverId} = await params
    // console.log(driverId)
    const response = await getExpenseByDriverId(Number(driverId));
    // console.log("Response from trip/driver: ",response)
    if(response.ok){
        const data = await response.json()
        return NextResponse.json({data:data},{status:200})
    }
    return NextResponse.json({data:response},{status: 400});
}
