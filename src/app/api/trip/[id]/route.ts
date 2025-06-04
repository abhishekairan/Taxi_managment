import { NextRequest, NextResponse } from "next/server";
import { deleteTrip, getTrip, updateTrip } from "@/db/utilis";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const data = await getTrip(Number(params.id));
    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const data = await deleteTrip(Number(params.id));
    return NextResponse.json(data, { status: 200 });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();
    console.log(body);
    const response = await updateTrip(body.data);
    return NextResponse.json(response, { status: 200 });
}