'use client'

import { useCallback, useEffect, useState } from 'react';

const useFetchData = (url: URL) => {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.data);
      console.log(`Response recived for ${url}`,json)
    } catch (error) {
      console.log(`error recived for ${url}`,error)
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [url]);
  console.log("Returning data from useFetchData:",{ data, error, loading })
  return { data, error, loading };
};

export default useFetchData;
