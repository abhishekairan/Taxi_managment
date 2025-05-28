import { createVehicle, getAllVehicles } from "@/db/utilis";
import { VehcileDBSchema } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await getAllVehicles();
    if (!response) {
        return NextResponse.json("No vehicle found", { status: 404 });
    }
    return NextResponse.json(response,{status: 200});
    // return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    // console.log("🚀 ~ file: route.ts:20 ~ PUT ~ body:", body);
    const data = VehcileDBSchema.safeParse(body);
    if (!data.success) {
        return NextResponse.json(
            `Error while parsing data: ${data.error.errors}`,
            { status: 400 }
        );
    }
    const user = await createVehicle(data.data);
    if (!user) {
        return NextResponse.json("Error while adding Vehicle", { status: 404 });
    }
    return NextResponse.json(JSON.stringify(user), { status: 200 });
}