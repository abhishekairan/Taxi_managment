import { z } from 'zod'



// ----- Schema & Types for Forms ----- 




// ----- Schema & Types for database tables ----- 

// User Schema
export const UsersDBSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    password_hash: z.string(),
    role: z.string(),
    session_token: z.string()
})
// User Type
export type UserDBType = z.infer<typeof UsersDBSchema>


// Vehicle Schema
export const VehcileDBSchema = z.object({
  id: z.number(),
  vehicle_number: z.string(),
  speedometer_reading: z.number(),
  default_passenger: z.string().optional(),
  default_from_location: z.string().optional(),
  default_to_location: z.string().optional(),
});
// Vehicle Type
export type VehicleDBType = z.infer<typeof VehcileDBSchema>


// Trips Schema
export const TripsDBSchema = z.object({
  id: z.number(),
  driver_id: z.number(),
  vehicle_number: z.string(),
  passenger_name: z.string(),
  from_location: z.string(),
  to_location: z.string(),
  start_reading: z.number(),
  end_reading: z.number().optional(),
  start_time: z.string().optional(),
  end_time: z.coerce.string(),
  isRunning: z.boolean(),
})
// Trips Type
export type TripsDBType = z.infer<typeof TripsDBSchema>

// Expense Schema
export const ExpenseDBSchema = z.object({
  id: z.number(),
  trip_id: z.number(),
  amount: z.number(),
  description: z.string(),
  created_at: z.string().optional(),
})
// Expense Type
export type ExpenseDBType = z.infer<typeof ExpenseDBSchema>