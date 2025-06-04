import { NextRequest, NextResponse } from "next/server";
import { deleteExpense, getExpense } from "@/db/utilis";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const response = await getExpense(Number(params.id));
    if(response){
        return NextResponse.json({data:response}, {status:200});
    }
    return NextResponse.json({data:response}, {status: 400});
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const response = await deleteExpense(Number(params.id));
    console.log("Response from trip/driver: ", response);
    if(response){
        return NextResponse.json({success:response}, {status:200});
    }
    return NextResponse.json({success:response}, {status: 400});
}