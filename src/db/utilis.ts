import db from './index';
import { users, vehicles, trips, expense } from './schema';
import { eq,and } from 'drizzle-orm';
import { ExpenseDBType, TripsDBType, UserDBType, VehicleDBType } from '@/lib/type';

// ===== Helper functions =====

export async function getVehicleById(id: number) {
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return result[0] ?? null;
}

export async function getVehicleByNumber(number: string) {
  const result = await db.select().from(vehicles).where(eq(vehicles.vehicle_number, number));
  return result[0];
}

// ===== Users =====
export async function getAllUsers() {
  const data = await db.select().from(users)
  if(data.length>0){
    return data
  }
  return null
}

export async function getUser(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  if(!result) return null;
  return result[0]
}

export async function getUserByEmail(id: string) {
  const result = await db.select().from(users).where(eq(users.email, id));
  if(!result) return null;
  return result[0]
}

export async function createUser(data: typeof users.$inferInsert) {
  const {id} = (await db.insert(users).values(data).$returningId())[0];
  if (!id) return null
  const row = await getUser(Number(id))
  return row
}

export async function updateUser(data: UserDBType) {
  const response = await db.update(users).set(data).where(eq(users.id, data.id));
  if (!response) return null 
  const row = await getUser(data.id)
  return row
}

export async function deleteUser(id: number) {
  const response = await db.delete(users).where(eq(users.id, id));
  if(!response) return false
  const row = await getUser(id)
  if(!row) return true
  return false
}

// ===== Driver =====
export async function getAllDrivers() {
  const rows = await db.select({id: users.id,name: users.name,email:users.email,profile_image:users.profile_image,phone_number: users.phone_number}).from(users).where(eq(users.role, 'driver'));
  if(!rows) return null
  return rows;
}

export async function getDriver(id: number) {
  const result = await db.select({id: users.id,name: users.name,email:users.email,profile_image:users.profile_image,phone_number: users.phone_number}).from(users).where(eq(users.id, id));
  const driver = result[0];
  if (!driver) return null;
  return driver;
}

export async function getActiveDriver(){
  const active_trips = await getActiveTrips()
  if(!active_trips || active_trips.length<1) return null
  const driverIds = await Promise.all(active_trips.map(async (trip) => {
    const d̥river = await getDriver(trip.driver_id);
    return d̥river;
  }))
  return driverIds  
}
// ===== Vehicles =====
export async function getAllVehicles() {
  const rows = await db.select().from(vehicles);
  return rows;
}

export async function getVehicle(id: number) {
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  const vehicle = result[0];
  if (!vehicle) return null;
  return vehicle
}

export async function deleteVehicle(id: number) {
  const response = await db.delete(vehicles).where(eq(vehicles.id, id));
  if(!response) return false
  const row = await getVehicle(id)
  if(!row) return true
  return false
}

export async function createVehicle(data: VehicleDBType) {
  console.log(data)
  const {id} = (await db.insert(vehicles).values(data).$returningId())[0];
  if(!id) return null
  const row = await getVehicle(id)
  if(row) return row
  return null
}

export async function updateVehicle(vehicle: VehicleDBType) {
  if(!vehicle.id) return null
  const response = await db.update(vehicles).set(vehicle).where(eq(vehicles.id, vehicle.id));
  const row = await getVehicleById(vehicle.id) 
  if(row) return row
}



// ===== Trips =====

export async function getAllTrips() {
  const rows = await db.select().from(trips);
  if(!rows || rows.length<1) return null
  return rows
}

export async function getActiveTripByDriverId(driverId: number) {
  const result =await db.select().from(trips).where(and(eq(trips.driver_id, Number(driverId)),eq(trips.isRunning,true)));
  if (!result) return null;
  return result
}

export async function getActiveTrips(){
  const result = await db.select().from(trips).where(eq(trips.isRunning, true));
  // console.log("Active Trips",result)
  return result ?? null;
}


export async function getTrip(id: number) {
  const result = await db.select().from(trips).where(eq(trips.id, id));
  const trip = result[0];
  if (!trip) return null;
  return trip
}

export async function createTrip(data: TripsDBType) {

  await db.update(vehicles).set({speedometer_reading:data.start_reading}).where(eq(vehicles.vehicle_number,data.vehicle_number))
  const {id} = (await db.insert(trips).values(data).$returningId())[0];
  if(id){
    const newField = await getTrip(id)
    if(newField) return newField
  }
  return null
}

export async function updateTrip(data: TripsDBType) {
  if(!data.id) return null
  await db.update(trips).set(data).where(eq(trips.id, data.id));
  const row = await getTrip(data.id) 
  if(!row) return null
  return row
}

export async function deleteTrip(id: number) {
  const response = await db.delete(trips).where(eq(trips.id, id));
  if(!response) return false
  const row = await getTrip(id)
  if(!row) return true
  return false
}

// ===== Expense =====
export async function getAllExpenses() {
  const rows = await db.select().from(expense);
  return rows;
}

export async function getExpense(id: number) {
  const result = await db.select().from(expense).where(eq(expense.id, id));
  if (result.length>0) return result[0]
  return null
}

export async function getExpenseByDriverId(id: number) {
  const result = await db.select().from(expense).where(eq(expense.driver_id, id));
  if(result.length>0) return result[0]
  return null
}

export async function getExpensesByTripId(tripId: number) {
  const result = await db.select().from(expense).where(eq(expense.trip_id, tripId));
  if (!result) return null;
  return result[0]
}

export async function createExpense(data: ExpenseDBType) {
  const {id} = (await db.insert(expense).values(data).$returningId())[0];
  if(id){
    const newField = await getExpense(id)
    return newField
  }
  return null
}

export async function updateExpense(updates: ExpenseDBType) {
  if(!updates.id) return null
  const response = await db.update(expense).set(updates).where(eq(expense.id, updates.id));
  console.log(response)
  const row = await getExpense(updates.id)
  if(row) return row 
  return null
}

export async function deleteExpense(id: number) {
  const response = await db.delete(expense).where(eq(expense.id, id));
  if(!response) return false
  const row = await getExpense(id)
  if(!row) return true
  return false
}
