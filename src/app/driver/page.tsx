import { useUser } from '@/hooks/useUser'
import TripForm from '@/components/driver/TripForm';


async function Page() {
  const user = await useUser();
  console.log()
  const response = await fetch(new URL(`/api/trip/activetrip/${user?.userId}`, 'http://localhost:3000'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()
  return (
    <TripForm data={data} user={user}></TripForm>
  )
}

export default Page;