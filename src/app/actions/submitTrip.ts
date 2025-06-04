"use server"

import { createTrip, getVehicleByNumber, updateTrip, updateVehicle } from "@/db/utilis";
import { TripFormObject } from "@/lib/type";

export default async function submitTrip(value: TripFormObject){
    console.log("submittrip values:",value)
    if(value.id && value.id > 0){
        value.isRunning = false;
        value.end_time = new Date().toISOString();
        const vehicle = await getVehicleByNumber(value.vehicle_number);
        console.log("Vehicle Got before updating: ",vehicle)
        if(vehicle && vehicle.speedometer_reading){
            vehicle.speedometer_reading = value.end_reading || value.start_reading;
            await updateVehicle(vehicle);
        }
        const response = await updateTrip(value)
        console.log("awaited json response",response)
        if(response){
            // console.log("sSending data back from submitTrip: ",newData.data)
            return response;
        }
    }else{
        console.log("Data recived in else part")
        value.isRunning = true
        value.start_time = new Date().toISOString()
        console.log("Data after parsing: ",value)
        const createTripResponse =await createTrip(value)
        console.log("createTripResponse: ",createTripResponse)
        if(createTripResponse) return createTripResponse
        
    }
}