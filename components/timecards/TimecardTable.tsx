'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

import { Timecard } from '@/lib/actions/timecards'; // Import the actual Timecard type
import { format } from 'date-fns';

interface TimecardTableProps {
  timecards: Timecard[] | null;
  isLoading: boolean;
  error: any;
  userRole: string | null; // 'admin', 'pm', 'user', or null
  onEdit: (timecard: Timecard) => void; // Callback for edit button
  onDelete: (timecardId: number) => void; // Callback for delete button
  onRefresh: () => void; // Callback for refresh button
}

export function TimecardTable({
  timecards,
  isLoading,
  error,
  userRole,
  onEdit,
  onDelete,
  onRefresh,
}: TimecardTableProps) {

  const canModify = userRole === 'admin' || userRole === 'pm';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      // Assuming dateString is YYYY-MM-DD from Supabase date type
      const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Fallback to original string
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-4 shadow-sm">
        <div className="flex justify-end mb-4">
           <Skeleton className="h-10 w-[100px]" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {/* Adjust headers based on actual Timecard fields you want to show */}
              <TableHead>ID</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Total Pay</TableHead>
              {canModify && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                {canModify && <TableCell><Skeleton className="h-8 w-[120px]" /></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive" className="bg-white">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Timecards</AlertTitle>
        <AlertDescription>
          {error.message || 'An unexpected error occurred.'}
           <Button variant="secondary" size="sm" onClick={onRefresh} className="ml-4">
             Try Again
           </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!timecards || timecards.length === 0) {
    return (
       <Alert className="bg-white">
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Timecards Found</AlertTitle>
        <AlertDescription>
          There are no timecards matching the current filters.
          <Button variant="secondary" size="sm" onClick={onRefresh} className="ml-4">
             Refresh
           </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
       <div className="flex justify-end mb-4">
        <Button onClick={onRefresh} variant="outline" size="sm">Refresh</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Ensure these headers match the selected columns */}
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead className="text-right">Hours</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">Total Pay</TableHead>
            {canModify && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timecards.map((timecard) => (
            <TableRow key={timecard.id}>
              <TableCell className="font-medium">{timecard.id}</TableCell>
              <TableCell>{timecard.worker_name}</TableCell>
              <TableCell>{formatDate(timecard.date)}</TableCell>
              <TableCell>{timecard.project}</TableCell>
              <TableCell className="text-right">{timecard.hours}</TableCell>
              <TableCell className="text-right">{formatCurrency(timecard.wage_per_hour)}</TableCell>
              <TableCell className="text-right">{formatCurrency(timecard.total_pay)}</TableCell>
              {canModify && (
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(timecard)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(timecard.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 