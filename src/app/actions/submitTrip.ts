"use server"

import { createTrip, updateTrip } from "@/db/utilis";
import { TripFormObject, TripFormSchema, TripsDBSchema, TripsDBType } from "@/lib/type";

export default async function (value: TripFormObject){
    const newValues = TripsDBSchema.safeParse(value)
    console.log("submittrip values:",newValues)
    if(newValues.data?.isRunning && newValues.data.id && newValues.data.id > 0){
        newValues.data.isRunning = false
        newValues.data.end_time = new Date().toISOString()

        const response = await (await updateTrip(newValues.data.id,newValues.data))?.json()
        console.log("awaited json response",response)
        const newData = TripsDBSchema.safeParse(response)
        if(newData.success){
            // console.log("Sending data back from submitTrip: ",newData.data)
            return newData.data
        }
    }else{
        const data = TripsDBSchema.safeParse(value)
        console.log("Data recived in else part")

        if(data.success){
            console.log("Data Successfuly parsed")
            data.data.isRunning = true
            data.data.start_time = new Date().toISOString()
            console.log("Data after parsing: ",data.data)
            const createTripResponse =await(await createTrip(data.data)).json()
            const newTripData = TripFormSchema.safeParse(createTripResponse)
            if(newTripData.success){
                return newTripData.data
            }else{
                console.log(newTripData.error.errors)
            }
        }else{
            console.log(data.error.errors)
            return data.error.errors
        }
    }
}