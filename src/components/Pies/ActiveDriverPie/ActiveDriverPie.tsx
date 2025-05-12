'use client';

import {
  ActionIcon,
  Group,
  Paper,
  PaperProps,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import dynamic from 'next/dynamic';

import ErrorAlert from '@/components/ErrorAlert';
import Surface from '@/components/Surface';
import { useFetchData } from '@/hooks';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ActiveDriverPieProps = PaperProps;

const ActiveDriverPie = ({ ...others }: ActiveDriverPieProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const series = [44, 55, 41, 17, 15];
  const labels = ['Direct', 'Social', 'Search', 'Email', 'Other'];
  const {
    data: salesData,
    error: salesError,
    loading: salesLoading,
  } = useFetchData('/mocks/Sales.json');

  const options: any = {
    chart: { type: 'donut', fontFamily: 'Open Sans, sans-serif' },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
      states: {
        hover: {
          filter: {
            type: "none"
          }
        }
      },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: '400',
              color:
                colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
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
      theme.colors[theme.primaryColor][9],
      theme.colors[theme.primaryColor][5],
      theme.colors[theme.primaryColor][3],
      theme.colors[theme.primaryColor][2],
    ],
  };

  return (
    <Surface component={Paper} {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Drivers
        </Text>
        <ActionIcon variant="subtle">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>
      {/*@ts-ignore*/}
      <Chart
        options={options}
        series={series}
        labels={labels}
        type="donut"
        height={160}
        width={'100%'}
      />
      {salesError ? (
        <ErrorAlert
          title="Error loading sales data"
          message={salesError.toString()}
        />
      ) : (
        <DataTable
          highlightOnHover
          columns={[
            { accessor: 'source' },
            { accessor: 'revenue' },
            { accessor: 'value' },
          ]}
          records={salesData.slice(0, 4)}
          height={200}
          fetching={salesLoading}
        />
      )}
    </Surface>
  );
};

export default ActiveDriverPie;
