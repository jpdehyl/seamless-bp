'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/lib/types/supabase'; // Assuming this uses the newly generated types

// --- Type Definitions based on actual schema ---

// Using generated types is preferred, but defining here for clarity based on screenshots
// Make sure Database['public']['Tables']['timecards']['Row'] aligns with this
export type Timecard = Database['public']['Tables']['timecards']['Row'];
  // id: number; // Handled by Supabase type
  // worker_name: string;
  // date: string; // Date type
  // hours: number;
  // wage_per_hour: number;
  // total_pay: number | null;
  // balance_owed: number | null;
  // payment_amount: number | null;
  // payment_date: string | null; // Date type
  // project: string; // Text field
  // period: string | null;
  // created_at: string; // Timestamp

// Using generated Project type is preferred
export type Project = Database['public']['Tables']['projects']['Row'];
  // id: string; // uuid
  // name: string;
  // status: Database['public']['Enums']['project_status'] | null;
  // client_company: Database['public']['Enums']['client_company'] | null;
  // ... other project fields

// No Client table, so no Client type needed here

export type TimecardFilter = {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  // project filtering removed for now, needs different approach
};

// --- Data Fetching Functions ---

export async function fetchTimecards(filters?: TimecardFilter): Promise<{ data: Timecard[] | null; error: any }> {
  try {
    const supabase = await supabaseServer();
    // Select columns from the actual timecards table
    let query = supabase
      .from('timecards')
      .select('*') // Select all actual columns
      .order('date', { ascending: false }); // Order by date instead of updated_at

    // Apply date filter using the 'date' column
    if (filters?.dateRange?.from) {
      query = query.gte('date', filters.dateRange.from.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    if (filters?.dateRange?.to) {
      query = query.lte('date', filters.dateRange.to.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Timecard[], error: null };
  } catch (error) {
    console.error('Error fetching timecards:', error);
    return { data: null, error };
  }
}

// Fetch projects, filter by status 'In Progress'
export async function fetchProjects(includeInactive = false): Promise<{ data: Project[] | null; error: any }> {
  try {
    const supabase = await supabaseServer();
    let query = supabase
      .from('projects')
      .select('id, name, status, client_company') // Select relevant columns
      .order('name');

    if (!includeInactive) {
      // Filter by the actual 'status' enum value for active projects (lowercase)
      query = query.eq('status', 'in progress');
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Project[], error: null };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: null, error };
  }
}

// Removed fetchClients function

// --- CRUD Operations ---

// Helper function to check user role (replace with your actual implementation if different)
async function getUserRole(supabase: any): Promise<string | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Error fetching user or no user logged in:', userError);
    return null; // Or throw an error
  }
  return user.user_metadata?.role || 'user'; // Adjust based on your setup
}

// Use the actual Insert type from generated types if possible
type TimecardInsert = Omit<Database['public']['Tables']['timecards']['Insert'], 'id' | 'created_at'>;
// Example structure based on screenshot (adjust if generated type differs):
// {
//   worker_name: string;
//   date: string; // YYYY-MM-DD
//   hours: number;
//   wage_per_hour: number;
//   project: string; // Project name as text
//   total_pay?: number | null;
//   balance_owed?: number | null;
//   payment_amount?: number | null;
//   payment_date?: string | null; // YYYY-MM-DD
//   period?: string | null;
// }


export async function addTimecard(formData: TimecardInsert): Promise<{ data: Timecard | null; error: any }> {
  try {
    const supabase = await supabaseServer();
    const role = await getUserRole(supabase);
    if (role !== 'admin' && role !== 'pm') {
      throw new Error('Permission denied: Only Admins or PMs can add timecards.');
    }

    // Insert data matching the actual timecards table schema
    const { data, error } = await supabase
      .from('timecards')
      .insert([formData]) // Pass the formData object directly
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/timecards');
    return { data: data as Timecard, error: null };
  } catch (error) {
    console.error('Error adding timecard:', error);
    // Provide more specific feedback if possible
    return { data: null, error: error instanceof Error ? error.message : 'Failed to add timecard' };
  }
}

// Use the actual Update type from generated types if possible
type TimecardUpdate = Database['public']['Tables']['timecards']['Update'];

export async function updateTimecard(id: number, formData: TimecardUpdate): Promise<{ data: Timecard | null; error: any }> {
   try {
    const supabase = await supabaseServer();
    const role = await getUserRole(supabase);
    if (role !== 'admin' && role !== 'pm') {
      throw new Error('Permission denied: Only Admins or PMs can update timecards.');
    }

    // Update data matching the actual timecards table schema
    // Remove updated_at as it doesn't exist
    const { data, error } = await supabase
      .from('timecards')
      .update(formData)
      .eq('id', id) // id is number (int8)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/timecards');
    return { data: data as Timecard, error: null };
  } catch (error) {
    console.error(`Error updating timecard ${id}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update timecard' };
  }
}

export async function deleteTimecard(id: number): Promise<{ error: any }> {
  try {
    const supabase = await supabaseServer();
    const role = await getUserRole(supabase);
    if (role !== 'admin' && role !== 'pm') {
      throw new Error('Permission denied: Only Admins or PMs can delete timecards.');
    }

    const { error } = await supabase
      .from('timecards')
      .delete()
      .eq('id', id); // id is number (int8)

    if (error) throw error;

    revalidatePath('/timecards');
    return { error: null };
  } catch (error) {
    console.error(`Error deleting timecard ${id}:`, error);
    return { error: error instanceof Error ? error.message : 'Failed to delete timecard' };
  }
} 