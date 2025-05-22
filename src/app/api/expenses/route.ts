import { createExpense, getAllExpenses } from "@/db/utilis";
import { ExpenseDBSchema } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = await getAllExpenses();
    if (!response) {
        return NextResponse.json({error:"No Expenses found"}, { status: 404 });
    }
    return NextResponse.json({data:response},{status: 200});
    // return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const data = ExpenseDBSchema.safeParse(body.data)
    if(data.success){
        const newFieldRes = await createExpense(data.data);
        if(newFieldRes.ok){
            const newFieldValue = await newFieldRes.json()
            return NextResponse.json({data: newFieldValue},{status:200})
        }
    }else {
        return NextResponse.json({error:`Error while parsing data: ${data.error.errors}`}, { status: 404 });
    }
}