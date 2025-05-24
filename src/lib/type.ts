import { z } from 'zod'

// ----- Schema & Types Hooks ----- 

// useUser Schema
export const useUserSchema = z.object({
  userId: z.coerce.string(),
  email: z.coerce.string(),
  role: z.coerce.string(),
  name: z.coerce.string(),
  phoneNumber: z.coerce.string().optional(),
  profileImage: z.coerce.string().optional(),
  expiresAt: z.coerce.string(),
  iat: z.coerce.number(),
  exp: z.coerce.number()
})
// useUser Type
export type useUserType = z.infer<typeof useUserSchema>


// ----- Schema & Types for database tables ----- 

// User Schema
export const UsersDBSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    password_hash: z.string(),
    role: z.string(),
    session_token: z.string(),
    profile_image: z.string().nullable(),
    phone_number: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string()
})
// User Type
export type UserDBType = z.infer<typeof UsersDBSchema>

// Driver Schema
export const DriverUserSchema = UsersDBSchema.omit({password_hash:true,role:true,session_token:true})
// Driver Type
export type DriverUserType = z.infer<typeof DriverUserSchema>

// Vehicle Schema
export const VehcileDBSchema = z.object({
  id: z.number(),
  vehicle_number: z.string(),
  speedometer_reading: z.number().nullable(),
  default_passenger: z.string().optional().nullable(),
  default_from_location: z.string().optional().nullable(),
  default_to_location: z.string().optional().nullable(),
});
// Vehicle Type
export type VehicleDBType = z.infer<typeof VehcileDBSchema>


// Trips Schema
export const TripsDBSchema = z.object({
  id: z.coerce.number().optional(),
  driver_id: z.coerce.number(),
  vehicle_number: z.string().nonempty("Select a vehicle"),
  passenger_name: z.string().nonempty("Enter Passenger Name"),
  from_location: z.string().nonempty("Enter From location"),
  to_location: z.string().nonempty("Enter To Location"),
  start_reading: z.coerce.number().nonnegative("Enter correct Start Reading"),
  end_reading: z.coerce.number().optional().nullable(),
  start_time: z.string().optional(),
  end_time: z.coerce.string(),
  isRunning: z.boolean(),
})
// Trips Type
export type TripsDBType = z.infer<typeof TripsDBSchema>

// Expense Schema
export const ExpenseDBSchema = z.object({
  id: z.coerce.number().optional(),
  driver_id: z.coerce.number().nullable(),
  trip_id: z.coerce.number().nullable(),
  amount: z.coerce.number().nullable(),
  description: z.string().nullable(),
  created_at: z.string().nullable().optional(),
})
// Expense Type
export type ExpenseDBType = z.infer<typeof ExpenseDBSchema>



// ----- Schema & Types for Forms ----- 
// Trip Form Schema
export const TripFormSchema = TripsDBSchema.partial({}).refine((value)=> {
  if(value.start_reading && value.end_reading){
    return value.end_reading>=value.start_reading
  }
  return true
},{
  message: "Invalid End Reading",
  path: ['end_reading']
}).refine((value)=>{
  if(!value.start_reading){
    return false
  }
  return true
},{
  message: "Start Reading is required",
  path: ['start_reading']
})
// Trip Form Object
export type TripFormObject = z.infer<typeof TripFormSchema>

// Edit Expense Model Form Schema
export const EditExpenseFormSchema = z.object({
  id: z.coerce.number().optional(),
  driver_id: z.coerce.string().nonempty("Select Driver"),
  trip_id: z.coerce.string().optional().nullable(),
  amount: z.coerce.number().nonnegative("Enter correct Amount"),
  description: z.string().nonempty("Enter Description"),
})
// Edit Expense Model Form type
export type EditExpenseFormType = z.infer<typeof EditExpenseFormSchema>

// Profile Form Schema
export const ProfileFormSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 letters'),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
})
// Profile Form Type
export type ProfileFormType = z.infer<typeof ProfileFormSchema>

// ----- Schema & Types for Tables -----
// Expense Table Schema
export const ExpenseTableSchema = ExpenseDBSchema.extend({
  driver_id: DriverUserSchema
}) 
// Expense Table Type
export type ExpenseTableType = z.infer<typeof ExpenseTableSchema>