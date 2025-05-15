import { createVehicle, getAllVehicles } from "@/db/utilis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    // const token = req.headers.get("Authorization");
    // if (!token) {
    //     return new Response("Unauthorized", { status: 401 });
    // }
    // const user = await fetch("https://api.example.com/user", {
    //     headers: {
    //         Authorization: token,
    //     },
    // });
    // if (!user.ok) {
    //     return new Response("Unauthorized", { status: 401 });
    // }
    const response = await getAllVehicles();
    if (!response) {
        return new Response("No users found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const user = await createVehicle(body.data);
    if (!user) {
        return new Response("Error while adding Vehicle", { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
}