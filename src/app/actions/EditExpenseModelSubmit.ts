"use server"

import { updateExpense } from "@/db/utilis";
import { EditExpenseFormSchema, EditExpenseFormType, ExpenseDBSchema } from "@/lib/type";

export default async function EditExpenseModelSubmit(values: EditExpenseFormType){
    console.log(values)
    const newValues = ExpenseDBSchema.safeParse(values)
    console.log("newValues:",newValues)
    if(newValues.success){
        const response = await updateExpense(newValues.data);
        return true
    }
}