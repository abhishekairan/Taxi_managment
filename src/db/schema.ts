import { sql } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/mysql-core";


export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password_hash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 50 }),
  session_token: varchar('session_token', { length: 255 }),
  profile_image: varchar('profile_image', { length: 255 }),
  phone_number: varchar('phone_number', { length: 20 }),
  created_at: varchar('created_at', {length: 50}).default(sql`CURRENT_TIMESTAMP`),
  updated_at: varchar('updated_at', {length: 50}).default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const vehicles = mysqlTable('vehicles', {
  id: int('id').primaryKey().autoincrement(),
  vehicle_number: varchar('vehicle_number', { length: 50 }).notNull().unique(),
  speedometer_reading: int('speedometer_reading'),
  default_passenger: varchar('default_passenger', { length: 255 }),
  default_from_location: varchar('default_from_location', { length: 255 }),
  default_to_location: varchar('default_to_location', { length: 255 }),
});


export const trips = mysqlTable('trips', {
  id: int('id').primaryKey().autoincrement(),
  driver_id: int('driver_id').notNull().references(() => users.id),
  vehicle_number: varchar('vehicle_number', { length: 50 }).notNull().references(() => vehicles.vehicle_number),
  passenger_name: varchar('passenger_name', { length: 255 }).notNull(),
  from_location: varchar('from_location', { length: 255 }).notNull(),
  to_location: varchar('to_location', { length: 255 }).notNull(),
  start_reading: int('start_reading').notNull(),
  end_reading: int('end_reading'),
  start_time: varchar('start_time', {length: 50}).default(sql`CURRENT_TIMESTAMP`),
  end_time: varchar('end_time', {length: 50}),
  isRunning: boolean('running').default(true),
})

export const expense = mysqlTable('expense', {
  id: int('id').primaryKey().autoincrement(),
  driver_id: int('driver_id').references(() => users.id),
  trip_id: int('trip_id').references(() => trips.id),
  amount: int('amount'),
  description: text('description'),
  created_at: varchar('created_at', {length: 50}).default(sql`CURRENT_TIMESTAMP`),
})
