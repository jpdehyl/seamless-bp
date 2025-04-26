'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimecardFilters } from '@/components/timecards/TimecardFilters';
import { TimecardTable } from '@/components/timecards/TimecardTable';
import { TimecardModal } from '@/components/timecards/TimecardModal';
import { Toaster } from "@/components/ui/sonner"

// Import actions and types
import {
  fetchTimecards,
  deleteTimecard, // Import delete action
  Timecard,
  TimecardFilter,
} from '@/lib/actions/timecards';

// --- Placeholder for user role fetching --- V
// Replace this with your actual auth logic (e.g., from Supabase context/hook)
async function getUserRole(): Promise<string | null> {
  // Example: Fetch from metadata or a dedicated endpoint
  // const supabase = useSupabaseClient(); // Example client hook
  // const { data: { user } } = await supabase.auth.getUser();
  // return user?.user_metadata?.role || 'user';
  console.warn("Using placeholder getUserRole");
  // Simulate async fetch
  await new Promise(resolve => setTimeout(resolve, 50));
  return 'admin'; // Placeholder: return 'admin', 'pm', or 'user' for testing
}
// --- Placeholder end ---

export default function TimecardsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState<Partial<TimecardFilter>>({});
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [timecardToEdit, setTimecardToEdit] = React.useState<Timecard | null>(null);

  // Fetch user role on mount
  React.useEffect(() => {
    async function fetchRole() {
      const role = await getUserRole();
      setUserRole(role);
    }
    fetchRole();
  }, []);

  // Fetch timecards based on current filters
  const { data: timecardsData, isLoading, error, refetch } = useQuery({
    queryKey: ['timecards', filters], // Re-run query when filters change
    queryFn: () => fetchTimecards(filters),
    enabled: !!userRole, // Only fetch data once user role is known (or skip role check if not needed for fetching)
  });

  // --- Handlers ---
  const handleFilterChange = (newFilters: Partial<TimecardFilter>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleRefresh = () => {
    refetch();
  };

  // TODO: Implement Edit Modal Trigger
  const handleEdit = (timecard: Timecard) => {
    console.log("Edit timecard:", timecard);
    // setTimecardToEdit(timecard);
    // setIsEditModalOpen(true);
    alert("Edit functionality not fully implemented yet.");
    // Needs an Edit Modal component or extension of TimecardModal
  };

  // TODO: Implement Delete Confirmation
  const handleDelete = async (timecardId: number) => {
    if (!confirm(`Are you sure you want to delete timecard ${timecardId}?`)) {
        return;
    }
    try {
        const result = await deleteTimecard(timecardId);
        if (result.error) {
            throw new Error(result.error.message || 'Unknown error');
        }
        toast.success(`Timecard ${timecardId} deleted successfully.`);
        queryClient.invalidateQueries({ queryKey: ['timecards'] });
    } catch (err: any) {
        console.error("Error deleting timecard:", err);
        toast.error("Failed to delete timecard", { description: err.message });
    }
  };

  const canAdd = userRole === 'admin' || userRole === 'pm';

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Timecards</h2>
        {canAdd && (
           <TimecardModal mode="add">
             <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Timecard
            </Button>
          </TimecardModal>
        )}
      </div>

       {/* Filters Card - styled like dashboard */}
      <Card className="bg-card">
         <CardHeader>
           <CardTitle className="text-lg">Filters</CardTitle>
         </CardHeader>
         <CardContent>
           <TimecardFilters onFiltersChange={handleFilterChange} initialFilters={filters} />
         </CardContent>
       </Card>

      {/* Timecards Table Card */}
      <Card className="bg-card">
        {/* Optional Header for table card */}
        {/* <CardHeader>
          <CardTitle>Timecard List</CardTitle>
        </CardHeader> */}
        <CardContent className="pt-6"> { /* Add padding if no header */}
          <TimecardTable
            timecards={timecardsData?.data ?? null}
            isLoading={isLoading || userRole === null} // Also loading while fetching role
            error={error}
            userRole={userRole}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>

      {/* Central Toaster for notifications */}
      <Toaster richColors />

       {/* Placeholder for Edit Modal */}
       {/* {isEditModalOpen && timecardToEdit && (
         <EditTimecardModal
           timecard={timecardToEdit}
           isOpen={isEditModalOpen}
           onClose={() => setIsEditModalOpen(false)}
         />
       )} */}
    </div>
  );
} 