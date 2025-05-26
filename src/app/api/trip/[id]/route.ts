import { NextRequest, NextResponse } from "next/server";
import { deleteTrip, getTrip, updateTrip } from "@/db/utilis";

// GET request to fetch all trips for a driver
export async function GET(req: NextRequest, {params}: {params: {id:string}},) {
    const {id} = await params
    const data = await getTrip(Number(id));
    return NextResponse.json(data,{status: 200});
}

// Delete request to delete a trip
export async function DELETE(req: NextRequest, {params}: {params: {id:string}},){
    const {id} = await params
    const data = await deleteTrip(Number(id));
    return NextResponse.json(data,{status: 200});
}

// update request to update a trip
export async function UPDATE(req: NextRequest, {params}: {params: {id:string}},){
    const {id} = await params
    const body = await req.json();
    console.log(body)
    const response = await updateTrip(body.data);
    return NextResponse.json(response,{status: 200});
}