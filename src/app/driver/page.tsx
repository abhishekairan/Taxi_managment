import { useUser } from '@/hooks/useUser'
import TripForm from '@/components/driver/TripForm';

export async function submitTrip(prevstate:any,formdata: FormData){
  return prevstate
}

async function Page() {
  const user = await useUser();
  // console.log(user) => {
  //   userId: '2',
  //   email: 'driver',
  //   role: 'driver',
  //   name: 'User',
  //   expiresAt: '2025-05-22T05:14:36.525Z',
  //   iat: 1747631676,
  //   exp: 1748236476
  // }
  const response = await fetch(new URL(`/api/trip/activetrip/${user?.userId}`, 'http://localhost:3000'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()

  return (
    <TripForm user={user}></TripForm>
  )
}

export default Page;