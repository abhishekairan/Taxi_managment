import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: int('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password_hash: text('password_hash'),
  role: text('role'),
  created_at: text('created_at'),
  session_token: text('session_token')
});

export const vehicles = sqliteTable('vehicles', {
  id: int('id').primaryKey(),
  vehicle_number: text('vehicle_number'),
  speedometer_reading: int('speedometer_reading'),
  default_passenger: text('default_passenger'),
  default_from_location: text('default_from_location'),
  default_to_location: text('default_to_location'),
  assigned_driver_id: int('assigned_driver_id').references(() => users.id),
});

export const punches = sqliteTable('punches', {
  id: int('id').primaryKey(),
  driver_id: int('driver_id').references(() => users.id),
  vehicle_id: int('vehicle_id').references(() => vehicles.id),
  punch_type: text('punch_type'),
  passenger_name: text('passenger_name'),
  from_location: text('from_location'),
  to_location: text('to_location'),
  speedometer_reading: int('speedometer_reading'),
  timestamp: text('timestamp'),
});