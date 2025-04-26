'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { Database, Enums, Constants } from '@/lib/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod'; // Import zod for validation

export type Project = Database['public']['Tables']['projects']['Row'];

// Define interface for filter parameters
interface ProjectFilters {
    name?: string;
    status?: Enums<"project_status">;
    clientCompany?: Enums<"client_company">;
    projectNumber?: string;
    projectType?: Enums<"project_type_enum">;
    siteAddress?: string;
    clientPM?: Enums<"client_project_manager">;
    foreman?: Enums<"dehyl_foreman">;
    // TODO: Add pagination and sorting params later
}

// Update function signature to accept filters
export async function getProjects(filters: ProjectFilters = {}): Promise<{ projects: Project[] | null; error: PostgrestError | null }> {
    const supabase = await supabaseServer();
    let query = supabase
        .from('projects')
        .select('*') // Select all columns for now
        .order('created_at', { ascending: false }); // Default sort

    // Apply filters
    if (filters.name) {
        // Use ilike for case-insensitive partial matching on name
        query = query.ilike('name', `%${filters.name}%`);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.clientCompany) {
        query = query.eq('client_company', filters.clientCompany);
    }
    if (filters.projectNumber) {
        query = query.ilike('project_number', `%${filters.projectNumber}%`);
    }
    if (filters.projectType) {
        query = query.eq('project_type', filters.projectType);
    }
    if (filters.siteAddress) {
        query = query.ilike('site_address', `%${filters.siteAddress}%`);
    }
    if (filters.clientPM) {
        query = query.eq('client_project_manager', filters.clientPM);
    }
    if (filters.foreman) {
        query = query.eq('dehyl_foreman', filters.foreman);
    }

    const { data, error } = await query;

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

// Define a schema for project updates using Zod for validation
// Use actual enum values from Constants for validation
const UpdateProjectSchema = z.object({
    name: z.string().min(1, "Project name cannot be empty.").optional(),
    client_company: z.enum(Constants.public.Enums.client_company).optional(), 
    project_number: z.string().optional(),
    site_address: z.string().nullable().optional(),
    start_date: z.string().nullable().optional(), 
    end_date: z.string().nullable().optional(),
    status: z.enum(Constants.public.Enums.project_status).optional(),
    revenue: z.number().nullable().optional(),
    costs: z.number().nullable().optional(),
    margin: z.number().nullable().optional(),
    project_type: z.enum(Constants.public.Enums.project_type_enum).nullable().optional(),
    client_project_manager: z.enum(Constants.public.Enums.client_project_manager).nullable().optional(),
    dehyl_foreman: z.enum(Constants.public.Enums.dehyl_foreman).nullable().optional(),
    po_number: z.string().nullable().optional(),
    basic_scope_of_work: z.string().nullable().optional(),
});

// Type for the update payload remains the same
export type UpdateProjectPayload = z.infer<typeof UpdateProjectSchema>;

// Action to update multiple project fields
export async function updateProject(
    projectId: string,
    payload: UpdateProjectPayload
): Promise<{ success: boolean; error: PostgrestError | { message: string } | null }> {
    const validationResult = UpdateProjectSchema.safeParse(payload);
    if (!validationResult.success) {
        console.error("Project update validation failed:", validationResult.error.flatten());
        const firstError = validationResult.error.errors[0]?.message || "Invalid input data.";
        return { success: false, error: { message: firstError } };
    }

    if (!projectId) {
        return { success: false, error: { message: "Project ID is required." } };
    }

    const supabase = await supabaseServer();

    // Explicitly type the update data to match Supabase expectations if needed,
    // but validationResult.data should generally work if schema matches table.
    const updateData: Partial<Project> = validationResult.data;

    const { data, error } = await supabase
        .from('projects')
        .update(updateData) // Use the explicitly typed validated data
        .eq('id', projectId)
        .select()
        .single();

    if (error) {
        console.error(`Error updating project ${projectId}:`, error);
        return { success: false, error };
    }

    console.log(`Project ${projectId} updated successfully:`, data);

    // Revalidate the projects path to refresh the data on the page
    revalidatePath('/projects');
    revalidatePath('/dashboard'); // Also revalidate dashboard if it uses project data
    return { success: true, error: null };
} 