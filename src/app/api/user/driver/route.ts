import { createUser, getAllDrivers } from "@/db/utilis";
import { create } from "domain";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await getAllDrivers();
    if (!response) {
        return NextResponse.json("User not found", { status: 404 });
    }else{
    return NextResponse.json(response, { status: 200 });
    }
}


export async function PUT(req: NextRequest) {
    const body = await req.json();
    body.data.role = 'driver';
    const user = await createUser(body.data);
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
}