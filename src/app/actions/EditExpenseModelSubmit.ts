"use server"

import { createExpense, updateExpense } from "@/db/utilis";
import { EditExpenseFormSchema, EditExpenseFormType, ExpenseDBSchema } from "@/lib/type";

export default async function EditExpenseModelSubmit(values: EditExpenseFormType){
    if(!values.id){
        const newValues = ExpenseDBSchema.safeParse(values)
        if(newValues.success){
            const response = await createExpense(newValues.data);
            if(response) return response
            return undefined
        }
    }
    const newValues = ExpenseDBSchema.safeParse(values)
    if(newValues.success){
        console.log("newValues:",newValues)
        const response = await updateExpense(newValues.data);
        if(response) return response
        return undefined
    }
    console.log("newValues:",newValues.error.errors)
}