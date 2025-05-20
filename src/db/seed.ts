import db from './index';
import { users, vehicles, trips, expense } from './schema';

async function seed() {
  // // Insert users
  // const usersData = await Promise.all([
  //   db.insert(users).values({
  //     id: 1,
  //     name: 'John Driver',
  //     email: 'john@example.com',
  //     password_hash: await hash('password123', 10),
  //     role: 'driver',
  //     created_at: new Date().toISOString(),
  //     session_token: null
  //   }),
  //   db.insert(users).values({
  //     id: 2,
  //     name: 'Admin User',
  //     email: 'admin@example.com',
  //     password_hash: await hash('admin123', 10),
  //     role: 'admin',
  //     created_at: new Date().toISOString(),
  //     session_token: null
  //   })
  // ]);

  // Insert vehicles
  const vehiclesData = await db.insert(vehicles).values([
    {
      id: 1,
      vehicle_number: 'KA01MX1234',
      speedometer_reading: 50000,
      default_passenger: 'Regular Customer',
      default_from_location: 'Airport',
      default_to_location: 'City Center',
    },
    {
      id: 2,
      vehicle_number: 'KA01MX5678',
      speedometer_reading: 75000,
      default_passenger: 'VIP Customer',
      default_from_location: 'Hotel Zone',
      default_to_location: 'Shopping Mall',
    }
  ]);

  // Insert trips
  const tripsData = await db.insert(trips).values([
    {
      id: 1,
      driver_id: 1,
      vehicle_number: "KA01MX1234",
      passenger_name: 'Alice Smith',
      from_location: 'Airport',
      to_location: 'Hotel Zone',
      start_reading: 50000,
      end_reading: 50030,
      start_time: '2023-01-01T10:00:00',
      end_time: '2023-01-01T11:00:00',
      isRunning: false
    },
    {
      id: 2,
      driver_id: 1,
      vehicle_number: "KA01MX1234",
      passenger_name: 'Bob Johnson',
      from_location: 'Hotel Zone',
      to_location: 'Shopping Mall',
      start_reading: 50030,
      end_reading: null,
      start_time: '2023-01-01T14:00:00',
      end_time: null,
      isRunning: true
    }
  ]);

  // Insert expenses
  const expensesData = await db.insert(expense).values([
    {
      id: 1,
      trip_id: 1,
      amount: 500,
      description: 'Fuel',
      created_at: '2023-01-01T11:30:00'
    },
    {
      id: 2,
      trip_id: 1,
      amount: 200,
      description: 'Parking',
      created_at: '2023-01-01T12:00:00'
    }
  ]);

  console.log('Seed data inserted successfully!');
}

seed().catch(console.error);