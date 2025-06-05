import { NextRequest, NextResponse } from "next/server";
import { deleteTrip, getTrip, updateTrip } from "@/db/utilis";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const data = await getTrip(Number(id));
    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const data = await deleteTrip(Number(id));
    return NextResponse.json(data, { status: 200 });
}

export async function PUT(
    req: NextRequest,
) {
    const body = await req.json();
    console.log(body);
    const response = await updateTrip(body.data);
    return NextResponse.json(response, { status: 200 });
}