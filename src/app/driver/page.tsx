import { useUser } from '@/hooks/useUser'
import TripForm from '@/components/driver/TripForm';
import { vehicles } from '@/db/schema';

async function Page() {
  const user = await useUser();
  console.log()
  const response = await fetch(new URL(`/api/trip/activetrip/${user?.userId}`, 'http://localhost:3000'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const vehiclesResponse = await fetch(new URL('/api/vehicle', 'http://localhost:3000'),)
  const vehicles = await vehiclesResponse.json()
  const data = await response.json()
  console.log("user: ",user)
  console.log("data: ",data)
  console.log("vehicles: ",vehicles)
  return (
    <TripForm data={data} user={user} vehicles={vehicles}></TripForm>
  )
}

export default Page;