'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Import TimeScale for time-based axis
  ChartOptions, // Import ChartOptions type
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import adapter
import { enUS } from 'date-fns/locale'; // Import locale

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale
);

// Define the expected data structure for time series points
interface TimeSeriesDataPoint {
  date: string; // Expecting ISO string or Date object
  count: number;
}

interface ProjectTimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  description?: string;
}

export default function ProjectTimeSeriesChart({
  data,
  title = "Projects Over Time",
  description = "Number of projects created per period",
}: ProjectTimeSeriesChartProps) {

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No projects found to display time series.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    // Labels can be derived if needed, but time scale handles it
    // labels: data.map(item => item.date), 
    datasets: [
      {
        label: '', // Removed 'Projects Created' label
        data: data.map(item => ({ x: item.date, y: item.count })), // Use x/y for time scale
        borderColor: 'hsl(var(--primary))', // Use primary color from theme
        backgroundColor: 'hsla(var(--primary), 0.5)', // Use primary color with transparency
        tension: 0.1, // Slight curve to the line
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<'line'> = { // Specify type as 'line'
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend entirely
        position: 'top' as const,
      },
      title: {
        display: false, // Title is handled by CardHeader
        // text: title, 
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        type: 'time' as const, // Set x-axis type to time
        time: {
          unit: 'month' as const, // Display unit (e.g., 'day', 'week', 'month')
          tooltipFormat: 'MMM yyyy', // Format for tooltip
          displayFormats: {
             month: 'MMM yyyy' // Format for axis labels
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
            display: false, // Hide vertical grid lines
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Projects',
        },
        ticks: {
          stepSize: 1, // Ensure whole numbers for count
        },
         grid: {
            // Optional: customize horizontal grid lines
            // color: 'hsla(var(--border), 0.5)'
         }
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]"> {/* Set fixed height for chart container */}
        <Line options={options} data={chartData} />
      </CardContent>
    </Card>
  );
} 