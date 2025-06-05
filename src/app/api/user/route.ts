import { createUser, getAllUsers } from "@/db/utilis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const response = await getAllUsers();
    if (!response) {
        return new Response("No users found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const user = await createUser(body.data);
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
}