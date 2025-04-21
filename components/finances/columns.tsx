'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from '@/lib/actions/invoices'; // Use our manually defined type
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/types/supabase'; // For Enum types

// Type aliases for cleaner access to Enums
type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

const GST_RATE = 0.05; // 5%

// Helper function to format dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Define status colors 
const invoiceStatusColors: Record<InvoiceStatus, string> = {
    'Sent': 'bg-blue-500 hover:bg-blue-600',
    'Overdue': 'bg-red-500 hover:bg-red-600',
    'Paid': 'bg-green-500 hover:bg-green-600',
    'Cancelled': 'bg-gray-500 hover:bg-gray-600',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
    'Not paid': 'bg-yellow-500 hover:bg-yellow-600',
    'Paid': 'bg-green-500 hover:bg-green-600',
    'Cancelled': 'bg-gray-500 hover:bg-gray-600',
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'invoice_number',
    header: 'Invoice #',
  },
  {
    // TODO: Join with projects table to display project name/number
    accessorKey: 'project_id',
    header: 'Project',
    cell: ({ row }) => row.original.project_id, // Placeholder
  },
  {
    // TODO: Join with clients/projects table to display client name/code
    accessorKey: 'client_id',
    header: 'Client',
    cell: ({ row }) => row.original.client_id, // Placeholder
  },
  {
    accessorKey: 'date_issued',
    header: 'Issued',
    cell: ({ row }) => formatDate(row.original.date_issued),
  },
  {
    accessorKey: 'due_date',
    header: 'Due',
    cell: ({ row }) => formatDate(row.original.due_date),
  },
  {
    id: 'amount_pre_gst',
    header: 'Amount (Pre-GST)',
    cell: ({ row }) => formatCurrency(row.original.invoice_amount),
  },
  {
    id: 'gst_amount',
    header: 'GST (5%)',
    cell: ({ row }) => formatCurrency(row.original.invoice_amount * GST_RATE),
  },
  {
    id: 'total_amount',
    header: 'Total Amount',
    cell: ({ row }) => formatCurrency(row.original.invoice_amount * (1 + GST_RATE)),
  },
  {
    accessorKey: 'invoice_status',
    header: 'Inv. Status',
    cell: ({ row }) => {
        const status = row.original.invoice_status;
        if (!status) return '-';
        const colorClass = invoiceStatusColors[status] || 'bg-gray-400';
        return <Badge variant="default" className={`${colorClass} text-white`}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'payment_status',
    header: 'Pmt. Status',
    cell: ({ row }) => {
        const status = row.original.payment_status;
        if (!status) return '-';
        const colorClass = paymentStatusColors[status] || 'bg-gray-400';
        return <Badge variant="default" className={`${colorClass} text-white`}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Pmt. Method',
    cell: ({ row }) => row.original.payment_method || '-',
  },
   {
    accessorKey: 'payment_terms',
    header: 'Terms',
    cell: ({ row }) => row.original.payment_terms || '-',
  },
  // TODO: Add 'Actions' column
]; 