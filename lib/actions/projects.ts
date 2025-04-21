'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { Database } from '@/lib/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export type Project = Database['public']['Tables']['projects']['Row'];

// TODO: Add filtering, sorting, and pagination parameters
export async function getProjects(): Promise<{ projects: Project[] | null; error: PostgrestError | null }> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
        .from('projects')
        .select('*') // Select all columns for now
        .order('created_at', { ascending: false }); // Default sort

    if (error) {
        console.error("Error fetching projects:", error);
        return { projects: null, error };
    }

    return { projects: data, error: null };
}

// Action to update a specific project field
export async function updateProjectField(
    projectId: string,
    field: keyof Project, // Ensures field is a valid project column
    value: any // Use 'any' for flexibility, but validation might be needed
): Promise<{ success: boolean; error: PostgrestError | null }> {
    const supabase = await supabaseServer();

    // Basic validation (could be expanded)
    if (!projectId || !field) {
        console.error("Missing projectId or field for update");
        return { success: false, error: { message: "Invalid input", details: "", hint: "", code: "" } as PostgrestError };
    }

    const { error } = await supabase
        .from('projects')
        .update({ [field]: value })
        .eq('id', projectId);

    if (error) {
        console.error(`Error updating project ${field}:`, error);
        return { success: false, error };
    }

    // Revalidate the projects path to refresh the data on the page
    revalidatePath('/projects');
    return { success: true, error: null };
} 