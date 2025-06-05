import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionPayload } from "@/app/lib/session";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session")?.value;
        
        if (!sessionCookie) {
            return NextResponse.json({ user: null });
        }

        const userData = await decrypt(sessionCookie) as SessionPayload;
        if (!userData?.userId) {
            return NextResponse.json({ user: null });
        }

        // Fetch complete user data from database
        const user =( await db
            .select()
            .from(users)
            .where(eq(users.id, parseInt(userData.userId))))[0];

        if (!user) {
            return NextResponse.json({ user: null });
        }

        // Combine session data with database data
        const completeUserData: SessionPayload = {
            userId: String(user.id),
            email: user.email || '',
            role: user.role || '',
            name: user.name || '',
            phoneNumber: user.phone_number || '',
            profileImage: user.profile_image || '',
            expiresAt: userData.expiresAt,
        };

        return NextResponse.json({ 
            user: completeUserData 
        }, {
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Pragma': 'no-cache',
            }
        });
    } catch (error) {
        console.error('Error in session route:', error);
        return NextResponse.json({ user: null });
    }
}
