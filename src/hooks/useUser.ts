'use server'

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { useUserSchema } from "@/lib/type";

export const useUser = async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if(sessionCookie){
        const payload = await decrypt(sessionCookie);
        const user = useUserSchema.safeParse(payload)
        if (user.success) {
            // console.log("Payload",payload)
            return user.data
        }else{
            console.log(user.error.errors)
            return payload
        }
    }

};
