import { NextRequest, NextResponse } from "next/server";
import { getExpense } from "@/db/utilis";


export async function GET(req: NextRequest, {params}: {params: Promise<{id:string}>},) {
    const {id} = await params
    // console.log(driverId)
    const response = await getExpense(Number(id));
    // console.log("Response from trip/driver: ",response)
    if(response.ok){
        const data = await response.json()
        return NextResponse.json({data:data.data[0]},{status:200})
    }
    return NextResponse.json({data:response},{status: 400});
}