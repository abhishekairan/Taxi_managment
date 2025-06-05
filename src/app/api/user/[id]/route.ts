import { deleteUser, getUser, updateUser } from "@/db/utilis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params:Promise<{id:string}>},) {
    const {id} = await params
    const response = await getUser(Number(id));
    if(!response) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const response = await updateUser(body.data);
    if(!response) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function DELETE(req: NextRequest,{ params }: {params: Promise<{id:string}>}){
    const {id} = await params
    const response = await deleteUser(Number(id))
    if(!response) return NextResponse.json(response,{status:400})
    return NextResponse.json(response,{status:200})
}