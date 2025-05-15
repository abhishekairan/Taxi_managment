import { deleteVehicle, getVehicle, updateVehicle } from "@/db/utilis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params:{id:string}},) {
    const {id} = await params
    const response = await getVehicle(Number(id));
    if(!response) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function UPDATE(req: NextRequest, {params}: {params:{id:string}},) {
    const {id} = await params
    const body = await req.json();
    const response = await updateVehicle(Number(id),body.data);
    if(!response) {
        return new Response("Vehicle not found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function DELETE(req: NextRequest,{ params }: {params: {id:string}}){
    const {id} = await params
    const response = await deleteVehicle(Number(id))
    if(!response) return null
    return NextResponse.json(response,{status:200})
}