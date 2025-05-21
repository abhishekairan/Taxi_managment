import { useUser } from '@/hooks/useUser'
import TripForm from '@/components/driver/TripForm';
import { getActiveTripByDriverId } from '@/db/utilis';

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
  // const response = await fetch(new URL(`/api/trip/activetrip/${user?.userId}`, 'http://localhost:3000'), {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   }
  // })
  if(user){
    const data = await getActiveTripByDriverId(Number(user.userId))
    // console.log(data)
    if(!data){
    const newdata = {
      driver_id: user?.userId || 0,
      vehicle_number: '', 
      passenger_name: '',
      from_location: '',
      to_location: '',
      start_reading: 0,
      end_reading: 0,
      start_time: '',
      end_time: '',
      isRunning: false
    }
    // console.log("No Active Trip found")
    return (
      <TripForm formData={newdata}></TripForm>
    )}
  // console.log("active trip found")
  return (
    <TripForm formData={data}></TripForm>
  )
}
}

export default Page;