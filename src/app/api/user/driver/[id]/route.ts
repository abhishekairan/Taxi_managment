import { getDriver } from "@/db/utilis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, {params}: {params:Promise<{id:string}>},) {
    const {id} = await params
    const response = await getDriver(Number(id));
    if(!response) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}
