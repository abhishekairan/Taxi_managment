import { getActiveDriver} from "@/db/utilis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await getActiveDriver();
    if (!response) {
        return NextResponse.json("User not found", { status: 404 });
    }else{
    return NextResponse.json(response, { status: 200 });
    }
}
