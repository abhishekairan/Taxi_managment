'use client';

import { useEffect, useState } from 'react';
import TripForm from '@/components/driver/TripForm';
import { useUserContext } from '@/context/UserContext';

function Page() {
  const { user } = useUserContext();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripData = async () => {
      if (user?.userId) {
        try {
          const response = await fetch(`/api/trip/activetrip/${user.userId}`);
          const data = await response.json();
          setTripData(data);
        } catch (error) {
          console.error('Error fetching trip data:', error);
          // Set empty trip data on error
          setTripData(null);
        }
        setLoading(false);
      }
    };

    fetchTripData();
  }, [user?.userId]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const formData = tripData || {
    driver_id: Number(user.userId),
    vehicle_number: '', 
    passenger_name: '',
    from_location: '',
    to_location: '',
    start_time: '',
    end_time: '',
    isRunning: false
  };

  return <TripForm formData={formData} />;
}

export default Page;