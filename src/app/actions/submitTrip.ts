"use server"

import { createTrip, updateTrip } from "@/db/utilis";
import { redirect } from "next/navigation";

export interface formProps {
    id: number | undefined;
    driver_id: string | undefined;
    vehicle_id: string | undefined;
    passenger_name: string | undefined;
    from_location: string | undefined;
    to_location: string | undefined;
    start_reading: number | undefined;
    end_reading: number | undefined;
    isRunning: boolean
}

export default async function (value: formProps){
    return new Promise(async (res,rej)=>{
        console.log(value)
        if(value.isRunning){
            if(!value.id) return
            value.isRunning = false
            await updateTrip(value.id,value)
            res(true)
        }else{
            // console.log(value)
            createTrip(value)
        }
    })
}