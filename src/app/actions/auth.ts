"use server";

import { createSession } from "@/app/lib/session";
import db from "@/db/index";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";
import { eq,  } from "drizzle-orm";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";
import { redirect } from "next/navigation";

export interface userData {
  email: string;
  password: string;
}

export const handleSubmit = async (prevstate: FormState, form: FormData) => {
  // console.log("Form submitted:", form.values());
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  // console.log("Email: ", email);
  // console.log("Password: ", password);

  const validatedFields = SignupFormSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Temprory Registering new user
  // const data = JSON.stringify({formData: {
  //     email: email,
  //     password: password,
  //     role: "driver",
  //   }})
  // const response = await fetch(new URL("/api/register","http://localhost:3000"),{
  //   method: "POST",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: data
  // })
  // --!!--
    const user = (await db
      .select()
      .from(users)
      .where(eq(users.email, email)))[0];
    if (!user || !user.password_hash) {
      return {
        errors: { email: ["User not found"] },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return {
        errors: { password: ["Invalid password"] },
      };
    }

    // First, clear any existing session token
    await db
      .update(users)
      .set({ session_token: null })
      .where(eq(users.id, user.id));

    // Create new session
    const session_token = await createSession(user);

    // Update user with new session token
    await db
      .update(users)
      .set({ session_token: session_token })
      .where(eq(users.id, user.id));

    if(user.role === "admin") {
      redirect("/dashboard");
    }else{
      redirect("/driver");
    }

  // Redirect after try-catch block
};
