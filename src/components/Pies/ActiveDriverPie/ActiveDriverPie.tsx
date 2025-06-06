'use client';

import {
  Avatar,
  Flex,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import dynamic from 'next/dynamic';

import Surface from '@/components/Surface';
import { useEffect, useState } from 'react';
import { DriverUserType, TripTableType, VehicleDBType } from '@/lib/type';
import { ApexOptions } from 'apexcharts';
import 'mantine-datatable/styles.layer.css';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });



type ActiveDriverPieProps = PaperProps;



const ActiveDriverPie = ({ ...others }: ActiveDriverPieProps) => {

  const [drivers, setdrivers] = useState<DriverUserType[]>([]);
  const [ Vehicleseries , setVehicleSeries ] = useState<number[]>([]);
  const [cars, setCars] = useState<VehicleDBType[]>([])
  const [activeDrivers, setActiveDrivers] = useState<DriverUserType[]>([]);
  const [ activeTrips, setActiveTrips ] = useState<TripTableType[]>([]);
  const [ series , setSeries ] = useState<number[]>([]);

  // Useeffect to fetch drivers data
  useEffect(() => {
    const fetchData = async () => {
      const allDrivers = await fetch('/api/user/driver/');
      const alldata = await allDrivers.json();
      if (alldata) setdrivers(alldata);
      const activeDrivers = await fetch('/api/user/driver/active');
      const data = await activeDrivers.json();
      console.log("Active Drivers Data",data)
      if(data != "User not found") setActiveDrivers(data);
      const activeTripsResponse = await fetch('/api/trip/activetrip');
      const activeTripsData = await activeTripsResponse.json(); 
      console.log("Active Trips Data",activeTripsData)
      if(activeTripsData != "No active trips found") setActiveTrips(activeTripsData);
      const allVehicles = await fetch('/api/vehicle')
      const allvehicleData = await allVehicles.json()
      setCars(allvehicleData)
    }
    fetchData();
  },[])

  // UseEffect to set series data
  useEffect(() => {
    if (drivers.length > 0 && activeDrivers.length > 0) {
      setSeries([drivers.length, activeDrivers.length]);
      setVehicleSeries([cars.length, activeDrivers.length])
    }
  }, [drivers, activeDrivers, cars ]);
    

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const labels = ['Total Drivers', 'Active Drivers'];
  const vehicleLabels = ['Total Vehicles', 'Active Vehicles'];

  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Open Sans, sans-serif' },
    legend: { show: false },
    labels: labels,
    dataLabels: { enabled: true ,
      formatter: (val: number,opts) => {
        const index = opts.seriesIndex;
        const value = opts.w.config.series[index];
        return `${value}`;
      },
      style: {
        fontSize: '16px',
        colors: [theme.white],
      },
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: '400',
              formatter: () => "Drivers"
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: '600',
              color:
                colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
            },
            total: {
              show: true,
              showAlways: true,
              color:
                colorScheme === 'dark' ? theme.white : theme.colors.dark[8],
            },
          },
        },
      },
    },
    colors: [
      theme.colors.blue[8],
      theme.colors.green[8],
    ],
  };

  const optionsCar: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Open Sans, sans-serif' },
    legend: { show: false },
    labels: vehicleLabels,
    dataLabels: { enabled: true ,
      formatter: (val: number,opts) => {
        const index = opts.seriesIndex;
        const value = opts.w.config.series[index];
        return `${value}`;
      },
      style: {
        fontSize: '16px',
        colors: [theme.white],
      },
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '10px',
              fontWeight: '400',
              formatter: () => "Vehicles"
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: '600',
              color:
                colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
            },
            total: {
              show: true,
              showAlways: true,
              color:
                colorScheme === 'dark' ? theme.white : theme.colors.dark[8],
            },
          },
        },
      },
    },
    colors: [
      theme.colors.blue[8],
      theme.colors.green[8],
    ],
  };

  const columns: DataTableColumn<TripTableType>[] = [
    { accessor: 'id', title: 'Trip ID' },
    { accessor: 'driver_id.name', title: 'Driver', render: ({ driver_id }: TripTableType) => {
        return (
              <Flex gap="xs" align="center">
                <Avatar
                  src={driver_id.profile_image || ''}
                  alt={`${driver_id.name}`}
                  variant="filled"
                  radius="xl"
                  color={theme.colors[theme.primaryColor][7]}
                >
                </Avatar>
                <Stack gap={1}>
                  <Text fw={600}>{driver_id.name}</Text>
                  <Text fz="sm">{driver_id.email}</Text>
                </Stack>
              </Flex>
        );
      }
    },
    { accessor: 'passenger_name', title: 'Passenger' },
    { accessor: 'vehicle_number', title: 'Vehicle' }
  ];

  return (
    <Surface component={Paper} {...others}>
      <Group justify="center" mb="md">
        <Chart
          options={options}
          series={series}
          type="donut"
          height={160}
          width={'100%'}
          />
        <Chart
          options={optionsCar}
          series={Vehicleseries}
          type="donut"
          height={160}
          width={'100%'}
          />


      </Group>
        <DataTable<TripTableType>
          highlightOnHover
          columns={columns}
          records={activeTrips.length > 1 ? activeTrips.slice(0, 4): []}
          height={200}
          />
    </Surface>
  );
};

export default ActiveDriverPie;
