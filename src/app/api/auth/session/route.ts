import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionPayload } from "@/app/lib/session";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) {
        return NextResponse.json({ user: null });
    }

    try {
        const userData = await decrypt(sessionCookie) as SessionPayload;
        if (!userData?.userId) {
            return NextResponse.json({ user: null });
        }

        // Fetch complete user data from database
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, parseInt(userData.userId)))
            .get();

        console.log('Database user data:', user);

        if (!user) {
            return NextResponse.json({ user: null });
        }

        // Combine session data with database data
        const completeUserData: SessionPayload = {
            ...userData,
            profileImage: user.profile_image || '',
            phoneNumber: user.phone_number || '',
        };

        console.log('Complete user data being sent:', completeUserData);

        return NextResponse.json({ user: completeUserData });
    } catch (error) {
        console.error('Error decrypting session:', error);
        return NextResponse.json({ user: null });
    }
}
