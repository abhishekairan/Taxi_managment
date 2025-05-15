'use server'

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

export const useUser = async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if(sessionCookie){
        const payload = await decrypt(sessionCookie);
        if (payload) {
            return payload
        }

    }

};
