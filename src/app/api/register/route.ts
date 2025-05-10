import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import db from "@/db/index";
import { users } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { createSession } from "@/app/lib/session";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { formData } = await req.json();
    console.log(`formdata: ${formData}`);
    // console.log(`formdata Email: ${formData.email}`)
    // Validate form data
    if (!formData.email || !formData.password) {
      // return res.status(400).json({ message: 'Email and password are required' });
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    try {
      const { email, password, role, name } = formData;
      // Check if the user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      if (existingUser) {
        // return res.status(409).json({ message: 'User already exists' });
        return NextResponse.json(
          { message: "User already exists" },
          { status: 409 }
        );
      }
      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);

      const dbresponse = await db
        .insert(users)
        .values({
          email: email,
          password_hash: password_hash,
          role: role ? role : "admin",
          name: name ? name : "User",
        })
        .run();

      const user = db
        .select()
        .from(users)
        .where(eq(users.id, Number(dbresponse.lastInsertRowid)))
        .get();

      if (!user) return;
      
      const session_token = await createSession(user);
        
      return NextResponse.json(
        {message: "User registered"}
      )
    } catch (error) {
      console.error("Error during registration:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // Handle other HTTP methods
  //   res.setHeader('Allow', ['POST']);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
}
