import { NextResponse } from 'next/server';
import db from './index';
import { users, vehicles, trips, expense } from './schema';
import { eq,and } from 'drizzle-orm';

// ===== Helper functions =====
async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

async function getVehicleById(id: number) {
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
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
    ...result,
    driver_id: await getDriver(result.driver_id),
    vehicle_id: await getVehicleById(result.vehicle_id)
  };
}

export async function getActiveTrips(){
  const result = await db.select().from(trips).where(eq(trips.isRunning, true));
  return result ?? null;
}

export async function getAllTrips() {
  const rows = await db.select().from(trips);
  return await Promise.all(rows.map(async (t) => ({
    ...t,
    driver_id: await getDriver(t.driver_id),
    vehicle_id: await getVehicleById(t.vehicle_id)
  })));
}

export async function getTrip(id: number) {
  const result = await db.select().from(trips).where(eq(trips.id, id));
  const trip = result[0];
  if (!trip) return null;

  return {
    ...trip,
    driver_id: await getDriver(trip.driver_id),
    vehicle_id: await getVehicleById(trip.vehicle_id)
  };
}

export async function createTrip(data: any) {
  let driverId: number;
  let vehicleId: number;

  if (typeof data.driver_id === 'object') {
    const driver = await getUserById(data.driver_id.id);
    if (!driver) throw new Error('Invalid driver object');
    driverId = driver.id;
  } else {
    const driver = await getUserById(data.driver_id);
    if (!driver) throw new Error('Invalid driver ID');
    driverId = driver.id;
  }

  if (typeof data.vehicle_id === 'object') {
    const vehicle = await getVehicleById(data.vehicle_id.id);
    if (!vehicle) throw new Error('Invalid vehicle object');
    vehicleId = vehicle.id;
  } else {
    const vehicle = await getVehicleById(data.vehicle_id);
    if (!vehicle) throw new Error('Invalid vehicle ID');
    vehicleId = vehicle.id;
  }

  await db.update(vehicles).set({speedometer_reading:data.start_reading}).where(eq(vehicles.id,Number(data.vehicle_id)))
  const response = await db.insert(trips).values({ ...data, driver_id: driverId, vehicle_id: vehicleId });

  return NextResponse.json(response, { status: 200 });
}

export async function updateTrip(id: number, updates: any) {
  if ('driver_id' in updates) {
    if (typeof updates.driver_id === 'object') {
      const driver = await getUserById(updates.driver_id.id);
      if (!driver) throw new Error('Invalid driver object');
      updates.driver_id = driver.id;
    } else {
      const driver = await getUserById(updates.driver_id);
      if (!driver) throw new Error('Invalid driver ID');
    }
  }

  if ('vehicle_id' in updates) {
    if (typeof updates.vehicle_id === 'object') {
      const vehicle = await getVehicleById(updates.vehicle_id.id);
      if (!vehicle) throw new Error('Invalid vehicle object');
      updates.vehicle_id = vehicle.id;
    } else {
      const vehicle = await getVehicleById(updates.vehicle_id);
      if (!vehicle) throw new Error('Invalid vehicle ID');
    }
  }
  await db.update(vehicles).set({speedometer_reading:updates.end_reading}).where(eq(vehicles.id,Number(updates.vehicle_id)))
  const response = await db.update(trips).set(updates).where(eq(trips.id, id));
  return NextResponse.json(response, { status: 200 });
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
