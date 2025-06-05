import { deleteVehicle, getVehicle, updateVehicle } from "@/db/utilis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params:Promise<{id:string}>},) {
    const {id} = await params
    const response = await getVehicle(Number(id));
    if(!response) {
        return NextResponse.json("User not found", { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
}

export async function PUT(req: NextRequest, {params}: {params:Promise<{id:string}>},) {
    const {id} = await params
    const body = await req.json();
    const response = await updateVehicle(body.data);
    if(!response) {
        return NextResponse.json("Vehicle not found", { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
}

export async function DELETE(req: NextRequest,{ params }: {params:Promise<{id:string}>}){
    const {id} = await params
    const response = await deleteVehicle(Number(id))
    if(!response) return NextResponse.json(response,{status:400})
    return NextResponse.json(response,{status:200})
}