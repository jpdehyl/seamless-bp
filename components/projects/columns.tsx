'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Project } from '@/lib/actions/projects'; // Import the Project type
import { Badge } from '@/components/ui/badge';

// Helper function to format dates (optional, can be done inline)
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper function to format currency
const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Define status colors (adjust as needed)
const statusColors: Record<Project['status'], string> = {
    'bidding': 'bg-yellow-500 hover:bg-yellow-600',
    'won': 'bg-blue-500 hover:bg-blue-600',
    'lost': 'bg-red-500 hover:bg-red-600',
    'no-go': 'bg-gray-500 hover:bg-gray-600',
    'in progress': 'bg-purple-500 hover:bg-purple-600',
    'completed': 'bg-green-500 hover:bg-green-600',
    'invoiced': 'bg-teal-500 hover:bg-teal-600',
    'closed': 'bg-gray-700 hover:bg-gray-800',
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Project Name',
    // TODO: Cell editing component
  },
  {
    accessorKey: 'client_company',
    header: 'Client',
    cell: ({ row }) => row.original.client_company || '-', 
    // TODO: Cell editing component (likely a select dropdown)
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.original.start_date),
    // TODO: Cell editing component (date picker)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colorClass = statusColors[status] || 'bg-gray-400';
      return (
        <Badge variant="default" className={`${colorClass} text-white`}>
          {status}
        </Badge>
      );
    },
    // TODO: Cell editing component (select dropdown)
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ row }) => formatCurrency(row.original.revenue),
    // TODO: Cell editing component (number input)
  },
  // TODO: Add an 'Actions' column for row-level operations (e.g., delete, view details)
]; 