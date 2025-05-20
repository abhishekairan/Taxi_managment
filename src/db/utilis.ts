import { NextResponse } from 'next/server';
import db from './index';
import { users, vehicles, trips, expense } from './schema';
import { eq,and } from 'drizzle-orm';
import { TripsDBSchema, TripsDBType, UsersDBSchema, VehcileDBSchema } from '@/lib/type';

// ===== Helper functions =====
async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

async function getVehicleById(id: number) {
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return result[0] ?? null;
}

async function getVehicleByNumber(number: string) {
  const result = await db.select().from(vehicles).where(eq(vehicles.vehicle_number, number));
  return result[0] ?? null;
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

export async function updateVehicle(id: number, updates: any) {
  if ('assigned_driver_id' in updates) {
    if (typeof updates.assigned_driver_id === 'object') {
      const user = await getUserById(updates.assigned_driver_id.id);
      if (!user) return null;
      updates.assigned_driver_id = user.id;
    } else {
      const user = await getUserById(updates.assigned_driver_id);
      if (!user) return null;
    }
  }
  const response = await db.update(vehicles).set(updates).where(eq(vehicles.id, id));
  if (!response || response.changes==0) return null
  return NextResponse.json(response,{status:200})
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
  const expenseData = result[0];
  if (!expenseData) return null;

  return expenseData;
}

export async function getExpensesByTripId(tripId: number) {
  const result = await db.select().from(expense).where(eq(expense.trip_id, tripId));
  if (!result) return null;
  return {
    ...result,
    trip_id: await getTrip(tripId),
  };
}

export async function createExpense(data: any) {
  let tripId: number;

  if (typeof data.trip_id === 'object') {
    const trip = await getTrip(data.trip_id.id);
    if (!trip) throw new Error('Invalid trip object');
    tripId = trip.id;
  } else {
    const trip = await getTrip(data.trip_id);
    if (!trip) throw new Error('Invalid trip ID');
    tripId = trip.id;
  }

  await db.insert(expense).values({ ...data, trip_id: tripId });
}

export async function updateExpense(id: number, updates: any) {
  if ('trip_id' in updates) {
    if (typeof updates.trip_id === 'object') {
      const trip = await getTrip(updates.trip_id.id);
      if (!trip) throw new Error('Invalid trip object');
      updates.trip_id = trip.id;
    } else {
      const trip = await getTrip(updates.trip_id);
      if (!trip) throw new Error('Invalid trip ID');
    }
  }

  await db.update(expense).set(updates).where(eq(expense.id, id));
}
