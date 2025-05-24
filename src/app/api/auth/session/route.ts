import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) {
        return NextResponse.json({ user: null });
    }

    try {
        const userData = await decrypt(sessionCookie);
        return NextResponse.json({ user: userData });
    } catch (error) {
        console.error('Error decrypting session:', error);
        return NextResponse.json({ user: null });
    }
}
