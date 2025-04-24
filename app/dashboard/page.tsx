'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData, DashboardFilters, DashboardData } from "@/lib/actions/dashboard";
import SummaryCard from "@/components/dashboard/SummaryCard";
// import DashboardTabs from "@/components/dashboard/DashboardTabs"; // Keep or remove based on where new sections go
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Example filter component
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Import the new component
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // For loading states
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error states
import { Bar } from 'react-chartjs-2'; // Import chart component
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Constants } from '@/lib/types/supabase'; // Import constants for enums
import { DateRange } from 'react-day-picker'; // Import DateRange type

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Placeholder Components for New Sections ---

// Placeholder for Project Status Distribution Chart
const ProjectStatusChart = ({ data }: { data: DashboardData['projectStatusDistribution'] }) => {
    if (!data || data.length === 0) return <p>No status data available.</p>;

    const chartData = {
        labels: data.map(item => item.status),
        datasets: [
            {
                label: 'Project Count',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Example color
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Project Status Distribution',
            },
        },
         scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Ensure whole numbers for count
                }
            }
        }
    };

    return <Bar options={options} data={chartData} />;
};

// Placeholder for Recent Invoices Table
const RecentInvoicesTable = ({ data }: { data: DashboardData['recentInvoices'] }) => {
    if (!data || data.length === 0) return <p>No recent invoices.</p>;
    // Basic table structure - use Shadcn Table components for better styling later
    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    <th className="text-left p-2">Number</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Payment Status</th>
                    <th className="text-left p-2">Issued</th>
                </tr>
            </thead>
            <tbody>
                {data.map(invoice => (
                    <tr key={invoice.id} className="border-b">
                        <td className="p-2">{invoice.invoice_number}</td>
                        <td className="p-2">${invoice.invoice_amount?.toFixed(2)}</td>
                        <td className="p-2">{invoice.invoice_status}</td>
                        <td className="p-2">{invoice.payment_status}</td>
                        <td className="p-2">{invoice.date_issued ? new Date(invoice.date_issued).toLocaleDateString() : '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Placeholder for Active Projects List
const ActiveProjectsList = ({ data }: { data: DashboardData['activeProjects'] }) => {
     if (!data || data.length === 0) return <p>No active projects match filters.</p>;
    // Basic list structure - use Cards or Table later
    return (
        <ul className="space-y-2">
            {data.map(project => (
                <li key={project.id} className="p-2 border rounded text-sm">
                   <strong>{project.name}</strong> ({project.status}) - {project.client_company}
                   {project.end_date && ` | Due: ${new Date(project.end_date).toLocaleDateString()}`}
                </li>
            ))}
        </ul>
    );
};

// Placeholder for Key Personnel (PMs)
const KeyPMsList = ({ data }: { data: DashboardData['keyPMs'] }) => {
    if (!data || data.length === 0) return <p>No PM data available.</p>;
    return (
        <ul className="space-y-1">
            {data.map(pm => (
                <li key={pm.id} className="text-sm">
                    {pm.name || 'Unnamed PM'}: {pm.activeProjectCount} active project(s)
                </li>
            ))}
        </ul>
    );
};

// --- Main Dashboard Component ---

export default function DashboardPage() {
    // State for filters
    const [filters, setFilters] = useState<DashboardFilters>({});
    // Separate state for the date range picker UI component
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    // Fetch data using useQuery
    const { data: queryResult, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardData', filters], // Re-run query when filters change
        queryFn: () => getDashboardData(filters),
        // Keep previous data while loading new data for smoother UX
        // Consider adding placeholderData or initialData if appropriate
         placeholderData: (previousData) => previousData,
    });

    // Extracted data or null
    const dashboardData = queryResult?.data;
    const fetchError = queryResult?.error || (isError ? error : null);

    // Update filters when date range changes
    const handleDateChange = (range: DateRange | undefined) => {
        setDateRange(range); // Update local state for the picker
        setFilters(prev => ({
             ...prev,
              startDate: range?.from?.toISOString(),
               endDate: range?.to?.toISOString()
        }));
    };

    const handleStatusChange = (value: string) => {
        // Assuming single select for now, adjust if multi-select is needed
        const status = value === 'all' ? undefined : [value as any]; // Cast needed due to action type
        setFilters(prev => ({ ...prev, statuses: status }));
    };

     const handleClientCompanyChange = (value: string) => {
        // Assuming single select
        const company = value === 'all' ? undefined : [value as any]; // Cast needed
        setFilters(prev => ({ ...prev, clientCompanies: company }));
    };

    // Get available statuses and companies from constants for filters
    const projectStatuses = Constants.public.Enums.project_status;
    const clientCompanies = Constants.public.Enums.client_company;

    // Format currency function (example)
    const formatCurrency = (value: number | null | undefined) => {
        if (value == null) return '-';
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h1 className="text-2xl font-semibold">Dashboard</h1>
                 {/* Filter Controls */}
                 <div className="flex flex-wrap items-center gap-2"> {/* Use items-center for alignment */}
                    {/* Date Range Picker Component */}
                    <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
                    <Select onValueChange={handleStatusChange} defaultValue="all">
                        <SelectTrigger className="w-auto min-w-[180px]"> {/* Adjust width */}
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {projectStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={handleClientCompanyChange} defaultValue="all">
                        <SelectTrigger className="w-auto min-w-[220px]"> {/* Adjust width */}
                            <SelectValue placeholder="Filter by Client Company" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Client Companies</SelectItem>
                            {clientCompanies.map(company => (
                                <SelectItem key={company} value={company}>{company}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Maybe add a Button to explicitly apply filters if needed */}
                 </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-64 md:col-span-2" />
                    <Skeleton className="h-64 md:col-span-2" />
                </div>
            )}

            {/* Error State */}
            {fetchError && (
                 <Alert variant="destructive">
                    <AlertTitle>Error Fetching Dashboard Data</AlertTitle>
                    <AlertDescription>
                        {fetchError.message || 'An unexpected error occurred.'}
                    </AlertDescription>
                </Alert>
            )}

            {/* Data Display (only render if not loading and no critical error) */}
            {!isLoading && dashboardData && (
                <>
                    {/* Summary Cards Section - Now 4 cards */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard
                            title="Total Revenue"
                            value={dashboardData.summaryMetrics.totalRevenue.value}
                            trend={dashboardData.summaryMetrics.totalRevenue.trend}
                            description="vs previous period"
                            formatAsCurrency={true}
                        />
                        <SummaryCard
                            title="New Client Companies"
                            value={dashboardData.summaryMetrics.newCustomers.value}
                            trend={dashboardData.summaryMetrics.newCustomers.trend}
                            description="vs previous period"
                        />
                        <SummaryCard
                            title="Work In Progress"
                            value={dashboardData.summaryMetrics.wipProjects.value}
                            trend={dashboardData.summaryMetrics.wipProjects.trend}
                            description="projects active"
                        />
                        <SummaryCard
                            title="Completed Revenue"
                            value={dashboardData.summaryMetrics.completedRevenue.value}
                            trend={dashboardData.summaryMetrics.completedRevenue.trend} // Currently null
                            description="in selected period"
                            formatAsCurrency={true}
                        />
                    </div>

                    {/* New Sections Grid */}
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                         {/* Project Status Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProjectStatusChart data={dashboardData.projectStatusDistribution} />
                            </CardContent>
                        </Card>

                         {/* Recent Invoices */}
                         <Card>
                             <CardHeader>
                                <CardTitle>Recent Invoices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <RecentInvoicesTable data={dashboardData.recentInvoices} />
                            </CardContent>
                        </Card>

                         {/* Active Projects */}
                        <Card>
                             <CardHeader>
                                <CardTitle>Active Projects Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActiveProjectsList data={dashboardData.activeProjects} />
                            </CardContent>
                        </Card>

                         {/* Key Personnel */}
                         <Card>
                             <CardHeader>
                                <CardTitle>Key PMs & Active Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <KeyPMsList data={dashboardData.keyPMs} />
                             </CardContent>
                        </Card>
                    </div>

                    {/* Original Tabs Section - Decide if needed */}
                    {/* <div>
                        <DashboardTabs />
                    </div> */}
                </>
            )}
        </div>
    );
} 