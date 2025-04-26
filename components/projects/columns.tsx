'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Project } from '@/lib/actions/projects'; // Import the Project type
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  // Reordered columns according to specification
  {
    accessorKey: 'client_company',
    header: 'Client',
    cell: ({ row }) => row.original.client_company || '-', 
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: 'Project Name',
    enableHiding: true,
  },
  {
    accessorKey: 'project_number',
    header: 'Project Number',
    enableHiding: true,
  },
  {
    accessorKey: 'site_address',
    header: 'Site Address',
    cell: ({ row }) => row.original.site_address || '-',
    enableHiding: true,
  },
  {
    accessorKey: 'revenue',
    header: 'Revenue',
    cell: ({ row }) => formatCurrency(row.original.revenue),
    enableHiding: true,
  },
  {
    accessorKey: 'costs',
    header: 'Costs',
    cell: ({ row }) => formatCurrency(row.original.costs),
    enableHiding: true,
  },
  {
    id: 'profit',
    header: 'Profit',
    cell: ({ row }) => {
      const revenue = row.original.revenue || 0;
      const costs = row.original.costs || 0;
      const profit = revenue - costs;
      return formatCurrency(profit > 0 ? profit : null);
    },
    enableHiding: true,
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.original.start_date),
    enableHiding: true,
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.original.end_date),
    enableHiding: true,
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
    enableHiding: true,
  },
  
  // Additional columns that will be hidden by default
  {
    accessorKey: 'project_type',
    header: 'Project Type',
    cell: ({ row }) => row.original.project_type || '-',
    enableHiding: true,
  },
  {
    accessorKey: 'client_project_manager',
    header: 'Client PM',
    cell: ({ row }) => row.original.client_project_manager || '-',
    enableHiding: true,
  },
  {
    accessorKey: 'dehyl_foreman',
    header: 'Foreman',
    cell: ({ row }) => row.original.dehyl_foreman || '-',
    enableHiding: true,
  },
  {
    accessorKey: 'po_number',
    header: 'PO Number',
    cell: ({ row }) => row.original.po_number || '-',
    enableHiding: true,
  },
  {
    accessorKey: 'margin',
    header: 'Margin',
    cell: ({ row }) => {
      const margin = row.original.margin;
      return margin !== null ? `${margin.toFixed(2)}%` : '-';
    },
    enableHiding: true,
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.created_at),
    enableHiding: true,
  },
  
  // Actions column
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const project = row.original;
      // Get the handler from table meta - this function will be passed from ProjectDataTable
      const handleEditClick = (table.options.meta as any)?.handleEditClick;
      
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
              if (handleEditClick) {
                  handleEditClick(project);
              } else {
                  console.error("handleEditClick not provided via table meta");
                  alert("Edit action not configured"); // Basic fallback
              }
          }}
        >
          Edit
        </Button>
      );
    },
    enableSorting: false, // Disable sorting for actions column
    enableHiding: false, // Disable hiding for actions column
  },
]; 