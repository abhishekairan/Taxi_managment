import { NextRequest, NextResponse } from "next/server";
import { deleteExpense, getExpense } from "@/db/utilis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  const response = await getExpense(Number(id));

  if (response) {
    return NextResponse.json({ data: response }, { status: 200 });
  }
  return NextResponse.json({ data: response }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  const response = await deleteExpense(Number(id));

  if (response) {
    return NextResponse.json({ success: response }, { status: 200 });
  }
  return NextResponse.json({ success: response }, { status: 400 });
}
