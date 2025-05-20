import { sql } from "drizzle-orm";
import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const users = sqliteTable('users', {
  id: int('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password_hash: text('password_hash'),
  role: text('role'),
  session_token: text('session_token')
});

export const vehicles = sqliteTable('vehicles', {
  id: int('id').primaryKey(),
  vehicle_number: text('vehicle_number').notNull().unique(),
  speedometer_reading: int('speedometer_reading'),
  default_passenger: text('default_passenger'),
  default_from_location: text('default_from_location'),
  default_to_location: text('default_to_location'),
});


export const trips = sqliteTable('trips', {
  id: int('id').primaryKey(),
  driver_id: int('driver_id').notNull().references(() => users.id),
  vehicle_number: text('vehicle_number').notNull().references(() => vehicles.vehicle_number),
  passenger_name: text('passenger_name').notNull(),
  from_location: text('from_location').notNull(),
  to_location: text('to_location').notNull(),
  start_reading: int('start_reading').notNull(),
  end_reading: int('end_reading'),
  start_time: text('start_time').default(sql`(current_timestamp)`),
  end_time: text('end_time'),
  isRunning: integer('running', {mode: 'boolean'}).default(true),
})

export const expense = sqliteTable('expense', {
  id: int('id').primaryKey(),
  trip_id: int('trip_id').references(() => trips.id),
  amount: int('amount'),
  description: text('description'),
  created_at: text('created_at').default(sql`(current_timestamp)`),
})
