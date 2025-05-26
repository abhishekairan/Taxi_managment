import { NextResponse } from 'next/server';
import { createExpense, getAllExpenses, updateExpense, deleteExpense, getAllDrivers, getAllTrips } from '@/db/utilis';
import { ExpenseDBSchema } from '@/lib/type';

export async function GET() {
  try {
    const expenses = await getAllExpenses();
    const drivers = await getAllDrivers();
    if (!expenses) {
      return NextResponse.json({ error: 'No expenses found' }, { status: 404 });
    }
    const data = expenses.map((expense) => {
      const driver = drivers?.find((d) => d.id === expense.driver_id);
      return {
        ...expense,
        driver_id: driver ? { id: driver.id, name: driver.name } : expense.driver_id
      };})
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = ExpenseDBSchema.safeParse(body);

    if (!data.success) {
      return NextResponse.json(
        { error: `Error while parsing data: ${data.error.errors}` },
        { status: 400 }
      );
    }

    const expense = await createExpense(data.data);
    if (!expense) {
      return NextResponse.json(
        { error: 'Failed to create expense' },
        { status: 500 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = ExpenseDBSchema.safeParse(body);

    if (!data.success) {
      return NextResponse.json(
        { error: `Error while parsing data: ${data.error.errors}` },
        { status: 400 }
      );
    }

    const expense = await updateExpense(data.data);
    if (!expense) {
      return NextResponse.json(
        { error: 'Failed to update expense' },
        { status: 500 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteExpense(Number(id));
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}