import { NextResponse } from 'next/server';
import db from './index';
import { users, vehicles, trips, expense } from './schema';
import { eq,and } from 'drizzle-orm';
import { ExpenseDBSchema, ExpenseDBType, TripsDBSchema, TripsDBType, UsersDBSchema, VehcileDBSchema, VehicleDBType } from '@/lib/type';

// ===== Helper functions =====
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

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
  return NextResponse.json(data, { status: 200 });
}

export async function getUser(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  if(!result) return null;
  return NextResponse.json(result, { status: 200 });
}

export async function createUser(data: typeof users.$inferInsert) {
  const response = await db.insert(users).values(data);
  if (!response) {
    return NextResponse.json({ error: 'User not created' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function updateUser(id: number, updates: Partial<typeof users.$inferInsert>) {
  const response = await db.update(users).set(updates).where(eq(users.id, id));
  if (!response) return null 
  return NextResponse.json(response,{status:200})
}

export async function deleteUser(id: number) {
  const response = await db.delete(users).where(eq(users.id, id));
  return NextResponse.json(response, { status: 200 });
}

// ===== Driver =====
export async function getAllDrivers() {
  const rows = await db.select({id: users.id,name: users.name,email:users.email}).from(users).where(eq(users.role, 'driver'));
  return rows;
}

export async function getDriver(id: number) {
  const result = await db.select({id: users.id,name: users.name,email:users.email}).from(users).where(eq(users.id, id));
  const driver = result[0];
  if (!driver) return null;
  return driver;
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
  return NextResponse.json(response, { status: 200 });
}

export async function createVehicle(data: any) {
  let driverId: number;

  if ('assigned_driver_id' in data) {
    if (typeof data.assigned_driver_id === 'object') {
      const user = await getUserById(data.assigned_driver_id.id);
      if (!user) return null
      driverId = user.id;
    } else {
      const user = await getUserById(data.assigned_driver_id);
      if (!user) return null
      driverId = user.id;
    }
    return NextResponse.json(users,{status:200})
  }

  await db.insert(vehicles).values({ ...data });
}

export async function updateVehicle(vehicle: VehicleDBType) {
  const response = await db.update(vehicles).set(vehicle).where(eq(vehicles.id, vehicle.id));
  const updatedVehicle = await getVehicleById(vehicle.id) 
  if(response.changes>0){
    console.log("Vehicle Updating and sending response",updatedVehicle)
    return NextResponse.json({data:updatedVehicle},{status:200})
  }
  return NextResponse.json(response,{status:400})
}



// ===== Trips =====

export async function getActiveTripByDriverId(driverId: number) {
  const result =await db.select().from(trips).where(and(eq(trips.driver_id, Number(driverId)),eq(trips.isRunning,true))).get();
  if (!result) return null;
  return {
    ...result
  };
}

export async function getActiveTrips(){
  const result = await db.select().from(trips).where(eq(trips.isRunning, true));
  return result ?? null;
}

export async function getAllTrips() {
  const rows = await db.select().from(trips);
  return await Promise.all(rows.map(async (t) => ({
    ...t
  })));
}

export async function getTrip(id: number) {
  const result = await db.select().from(trips).where(eq(trips.id, id));
  const trip = result[0];
  if (!trip) return null;

  return {
    ...trip,
  };
}

export async function createTrip(data: TripsDBType) {

  await db.update(vehicles).set({speedometer_reading:data.start_reading}).where(eq(vehicles.vehicle_number,data.vehicle_number))
  const response = await db.insert(trips).values(data);
  if(response.lastInsertRowid){
    const newField = await getTrip(Number(response.lastInsertRowid))
    return NextResponse.json(newField, { status: 200 });
  }
  return NextResponse.json(response, { status: 200 });
}

export async function updateTrip(id: number, data: TripsDBType) {
  const updates = TripsDBSchema.safeParse(data)
  if(updates.success){
    // console.log(updates.data)
    await db.update(trips).set(updates.data).where(eq(trips.id, id));
    const updatedData = await getTrip(id) 
    return NextResponse.json(updatedData, { status: 200 });
  }else{
    return null
  }
}

export async function deleteTrip(id: number) {
  const response = await db.delete(trips).where(eq(trips.id, id));
  return NextResponse.json(response, { status: 200 });
}

// ===== Expense =====
export async function getAllExpenses() {
  const rows = await db.select().from(expense);
  return rows;
}

export async function getExpense(id: number) {
  const result = await db.select().from(expense).where(eq(expense.id, id));
  if (result.length>0){
    return NextResponse.json({data: result},{status:200})
  }else{
    return NextResponse.json({data: result},{status:400})
  }
}

export async function getExpenseByDriverId(id: number) {
  const result = await db.select().from(expense).where(eq(expense.driver_id, id));
  if(result.length>0){
    return NextResponse.json({data: result},{status:200})
  }else{
    return NextResponse.json({error: result},{status:404})
  }
}

export async function getExpensesByTripId(tripId: number) {
  const result = await db.select().from(expense).where(eq(expense.trip_id, tripId));
  if (!result) return null;
  return {
    ...result,
    trip_id: await getTrip(tripId),
  };
}

export async function createExpense(data: ExpenseDBType) {
  const response = await db.insert(expense).values(data);
  if(response.lastInsertRowid>0){
    const newField = await getExpense(Number(response.lastInsertRowid))
    return NextResponse.json({data: newField},{status:200})
  }else{
    return NextResponse.json({error:response},{status:400})
  }
}

export async function updateExpense(updates: ExpenseDBType) {
  const response = await db.update(expense).set(updates).where(eq(expense.id, updates.id));
  console.log(response)
  if(response.changes>0){
    const newExpenseResponse = await(await getExpense(updates.id)).json()
    if(newExpenseResponse.ok){
      const newExpense = ExpenseDBSchema.safeParse(newExpenseResponse.data)
      return NextResponse.json({data: newExpense.data},{status:200})
    }
  }else{
    return NextResponse.json({data: response},{status:400})
  }
}
