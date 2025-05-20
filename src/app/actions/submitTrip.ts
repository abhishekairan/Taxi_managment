"use server"

import { createTrip, updateTrip } from "@/db/utilis";
import { TripsDBSchema, TripsDBType } from "@/lib/type";

export default async function (value: TripsDBType){
    const newValues = TripsDBSchema.safeParse(value)
    console.log("submittrip values:",newValues)
    if(newValues.data?.isRunning){
        if(!value.id || value.id<1) return
        newValues.data.isRunning = false
        newValues.data.end_time = new Date().toISOString()
        const response = await updateTrip(newValues.data.id,newValues.data)
        const newData = TripsDBSchema.safeParse(await response?.json())
        if(newData.success){
            // console.log("Sending data back from submitTrip: ",newData.data)
            return newData.data
        }
    }else{
        console.log(value)
        const data = TripsDBSchema.safeParse(value)
        if(data.success){
            data.data.start_time = new Date().toISOString()
            // createTrip(data.data)
        }
    }
}