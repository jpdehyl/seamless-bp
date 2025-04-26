'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { Database, Tables, Enums } from '@/lib/types/supabase';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

type ProjectStatus = Database['public']['Enums']['project_status'];
type UserRole = Database['public']['Enums']['user_role'];

// Define the statuses that represent 'Work in Progress'
const WIP_STATUSES: ProjectStatus[] = ['in progress', 'won']; // Added 'won' as potentially active
const COMPLETED_STATUSES: ProjectStatus[] = ['completed', 'closed', 'invoiced'];

// Filter type
export interface DashboardFilters {
    startDate?: string; // ISO string
    endDate?: string;   // ISO string
    statuses?: ProjectStatus[];
    clientCompanies?: Enums<"client_company">[]; // Use the specific Enum type
}

// Type Definitions for Fetched Data
interface Metric {
    value: number;
    trend: number | null;
}

interface ProjectStatusDistributionItem {
    status: ProjectStatus;
    count: number;
}

type RecentInvoice = Pick<Tables<'invoices'>, 'id' | 'invoice_number' | 'invoice_amount' | 'invoice_status' | 'payment_status' | 'date_issued'>;

type ActiveProject = Pick<Tables<'projects'>, 'id' | 'name' | 'status' | 'client_company' | 'end_date'>;

interface KeyPM {
    id: string;
    name: string | null;
    activeProjectCount: number;
}

// Combined type for all dashboard data
export interface DashboardData {
    summaryMetrics: {
        totalRevenue: Metric;
        newCustomers: Metric;
        wipProjects: Metric;
        completedRevenue: Metric; // Added metric for revenue from completed projects
    };
    projectStatusDistribution: ProjectStatusDistributionItem[];
    recentInvoices: RecentInvoice[];
    activeProjects: ActiveProject[];
    keyPMs: KeyPM[];
}


// Helper function to calculate percentage change
function calculateTrend(current: number, previous: number): number | null {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    // Avoid division by zero if previous is null or undefined somehow
    if (!previous) return null;
    return Math.round(((current - previous) / previous) * 100);
}

// --- Main Data Fetching Function ---

export async function getDashboardData(
    filters: DashboardFilters = {}
): Promise<{ data: DashboardData | null; error: PostgrestError | null }> {
    const supabase = await supabaseServer();
    let errorLog: string[] = []; // Store error messages as strings

    // --- Default Date Range (Last 30 days if not provided) ---
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
    const startDateDefault = new Date();
    startDateDefault.setDate(endDate.getDate() - 30);
    const startDate = filters.startDate ? new Date(filters.startDate) : startDateDefault;

    // Previous period for trend calculation (same duration as selected range)
    const dateRangeDuration = endDate.getTime() - startDate.getTime();
    const previousEndDate = new Date(startDate.getTime() - 1); // Day before the current start date
    const previousStartDate = new Date(previousEndDate.getTime() - dateRangeDuration);

    // Convert dates to ISO strings for Supabase
    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();
    const previousStartDateISO = previousStartDate.toISOString();
    const previousEndDateISO = previousEndDate.toISOString();


    // Helper to build base project query with filters
    const buildProjectQuery = (supabase: SupabaseClient<Database>, selectFields: string = '*') => {
        let query = supabase.from('projects').select(selectFields, { count: 'exact' });

        if (filters.startDate) {
            query = query.gte('created_at', startDateISO);
        }
        if (filters.endDate) {
            query = query.lte('created_at', endDateISO);
        }
        if (filters.statuses && filters.statuses.length > 0) {
            query = query.in('status', filters.statuses);
        }
        if (filters.clientCompanies && filters.clientCompanies.length > 0) {
            query = query.in('client_company', filters.clientCompanies);
        }
        return query;
    }

    // --- Summary Metrics ---

    // 1. Total Revenue (Current Period & Trend)
    let totalRevenueCurrent = 0;
    const revenueQueryCurrent = buildProjectQuery(supabase, 'revenue')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);
    const { data: revenueDataCurrent, error: revenueErrorCurrent } = await revenueQueryCurrent;

    if (revenueErrorCurrent) {
        errorLog.push(`Revenue (Current): ${revenueErrorCurrent.message}`);
    } else if (revenueDataCurrent !== null) {
        // Assert type after checks, via unknown
        const typedData = revenueDataCurrent as unknown as Array<{ revenue: number | null }>;
        totalRevenueCurrent = typedData.reduce((sum: number, p) => sum + (p.revenue ?? 0), 0);
    }

    let totalRevenuePrevious = 0;
    // Apply filters to the previous period revenue query
    let revenueQueryPreviousBase = supabase
        .from('projects')
        .select('revenue')
        .gte('created_at', previousStartDateISO)
        .lte('created_at', previousEndDateISO);

    if (filters.statuses && filters.statuses.length > 0) {
        revenueQueryPreviousBase = revenueQueryPreviousBase.in('status', filters.statuses);
    }
    if (filters.clientCompanies && filters.clientCompanies.length > 0) {
        revenueQueryPreviousBase = revenueQueryPreviousBase.in('client_company', filters.clientCompanies);
    }

    const { data: revenueDataPrevious, error: revenueErrorPrevious } = await revenueQueryPreviousBase;

    if (revenueErrorPrevious) {
        errorLog.push(`Revenue (Previous): ${revenueErrorPrevious.message}`);
    } else if (revenueDataPrevious !== null) {
        // Assert type after checks, via unknown
        const typedData = revenueDataPrevious as unknown as Array<{ revenue: number | null }>;
        totalRevenuePrevious = typedData.reduce((sum: number, p) => sum + (p.revenue ?? 0), 0);
    }
    const revenueTrend = calculateTrend(totalRevenueCurrent, totalRevenuePrevious);

    // 2. New Client Companies (Current Period & Trend)
    let distinctCustomersCurrent = 0;
    const customersQueryCurrent = buildProjectQuery(supabase, 'client_company')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);
    const { data: customersCurrent, error: custErrCurr } = await customersQueryCurrent;

    if (custErrCurr) {
        errorLog.push(`Customers (Current): ${custErrCurr.message}`);
    } else if (customersCurrent !== null) {
        // Assert type after checks, via unknown
        const typedData = customersCurrent as unknown as Array<{ client_company: Enums<"client_company"> | null }>;
        distinctCustomersCurrent = new Set(typedData.map(p => p.client_company).filter(Boolean)).size;
    }

    let distinctCustomersPrevious = 0;
    // Apply filters to the previous period customers query
    let customersQueryPreviousBase = supabase
        .from('projects')
        .select('client_company')
        .gte('created_at', previousStartDateISO)
        .lte('created_at', previousEndDateISO);

    if (filters.statuses && filters.statuses.length > 0) {
        customersQueryPreviousBase = customersQueryPreviousBase.in('status', filters.statuses);
    }
    if (filters.clientCompanies && filters.clientCompanies.length > 0) {
        // Note: Filtering distinct previous *customers* by *client company* might be slightly odd logic,
        // but we apply it for consistency with how the current period is filtered.
        // If the goal is truly *new* customers regardless of filter, this filter might be removed here.
        // Keeping it for now to match the pattern.
        customersQueryPreviousBase = customersQueryPreviousBase.in('client_company', filters.clientCompanies);
    }

    const { data: customersPrevious, error: custErrPrev } = await customersQueryPreviousBase;

    if (custErrPrev) {
        errorLog.push(`Customers (Previous): ${custErrPrev.message}`);
    } else if (customersPrevious !== null) {
        // Assert type after checks, via unknown
        const typedData = customersPrevious as unknown as Array<{ client_company: Enums<"client_company"> | null }>;
        distinctCustomersPrevious = new Set(typedData.map(p => p.client_company).filter(Boolean)).size;
    }
    const customerTrend = calculateTrend(distinctCustomersCurrent, distinctCustomersPrevious);

    // 3. Work in Progress Projects (Current Count & Trend)
    let wipProjectsCurrent = 0;
    const wipQueryCurrent = buildProjectQuery(supabase, 'id').in('status', WIP_STATUSES);
    const { count: wipCountCurrent, error: wipErrorCurrent } = await wipQueryCurrent;
    if (wipErrorCurrent) {
        errorLog.push(`WIP (Current): ${wipErrorCurrent.message}`);
    } else if (wipCountCurrent !== null) {
        // Type is correctly narrowed here (count is number | null)
        wipProjectsCurrent = wipCountCurrent; // Assign directly, default 0 handles null case effectively
    }

    let wipCountPrevious = 0;
    // Apply filters to the previous period WIP query
    let wipQueryPreviousBase = supabase
        .from('projects')
        .select('id', { count: 'exact', head: true }) // Use head: true for count only
        .in('status', WIP_STATUSES)
        .gte('created_at', previousStartDateISO)
        .lte('created_at', previousEndDateISO);

    // Only apply clientCompanies filter here, as status is already fixed to WIP_STATUSES
    if (filters.clientCompanies && filters.clientCompanies.length > 0) {
        wipQueryPreviousBase = wipQueryPreviousBase.in('client_company', filters.clientCompanies);
    }
    // Note: We don't apply filters.statuses because we are specifically looking for WIP_STATUSES here.

    const { count: wipCountPrevData, error: wipErrorPrevious } = await wipQueryPreviousBase;
    if (wipErrorPrevious) {
        errorLog.push(`WIP (Previous): ${wipErrorPrevious.message}`);
    } else if (wipCountPrevData !== null) {
        // Type is correctly narrowed here
        wipCountPrevious = wipCountPrevData ?? 0;
    }
    const wipTrend = calculateTrend(wipProjectsCurrent, wipCountPrevious);

    // 4. Completed Projects Revenue (Current Period)
    let completedRevenueCurrent = 0;
    const completedRevenueQuery = buildProjectQuery(supabase, 'revenue')
        .in('status', COMPLETED_STATUSES)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);
    const { data: completedRevenueData, error: completedRevenueError } = await completedRevenueQuery;

    if (completedRevenueError) {
        errorLog.push(`Completed Revenue: ${completedRevenueError.message}`);
    } else if (completedRevenueData !== null) {
        // Assert type after checks, via unknown
        const typedData = completedRevenueData as unknown as Array<{ revenue: number | null }>;
        completedRevenueCurrent = typedData.reduce((sum: number, p) => sum + (p.revenue ?? 0), 0);
    }
    const completedRevenueMetric: Metric = { value: completedRevenueCurrent, trend: null };

    // --- Project Status Distribution ---
    let projectStatusDistribution: ProjectStatusDistributionItem[] = [];
    const statusQuery = buildProjectQuery(supabase, 'status');
    const { data: statusData, error: statusError } = await statusQuery;

    if (statusError) {
        errorLog.push(`Status Distribution: ${statusError.message}`);
    } else if (statusData !== null) {
        // Assert type after checks, via unknown
        const typedStatusData = statusData as unknown as Array<{ status: ProjectStatus | null }>;
        const statusCounts = typedStatusData.reduce((acc: Record<ProjectStatus, number>, project) => {
            // Check project.status directly
            if (project.status) {
                acc[project.status] = (acc[project.status] || 0) + 1;
            }
            return acc;
        }, {} as Record<ProjectStatus, number>);
        projectStatusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
            status: status as ProjectStatus,
            count,
        }));
    }

    // --- Recent Invoices ---
    let recentInvoices: RecentInvoice[] = [];
    const invoicesQuery = supabase
        .from('invoices')
        .select('id, invoice_number, invoice_amount, invoice_status, payment_status, date_issued')
        .order('date_issued', { ascending: false })
        .limit(5);
    const { data: recentInvoicesData, error: invoicesError } = await invoicesQuery;
    if (invoicesError) {
        errorLog.push(`Recent Invoices: ${invoicesError.message}`);
    } else if (recentInvoicesData !== null) {
        // Assert type after checks - should match RecentInvoice[]
        recentInvoices = recentInvoicesData as unknown as RecentInvoice[];
    }

    // --- Active Projects Overview ---
    let activeProjects: ActiveProject[] = [];
    const activeProjectsQuery = buildProjectQuery(supabase, 'id, name, status, client_company, end_date')
        .in('status', WIP_STATUSES);
    const { data: activeProjectsData, error: activeProjectsError } = await activeProjectsQuery;

    if (activeProjectsError) {
        errorLog.push(`Active Projects: ${activeProjectsError.message}`);
    } else if (activeProjectsData !== null) {
        // Assert type after checks - should match ActiveProject[]
        activeProjects = activeProjectsData as unknown as ActiveProject[];
    }

    // --- Key Personnel (PMs) ---
    let keyPMs: KeyPM[] = [];
    const pmsQuery = supabase
        .from('users')
        .select('id, full_name')
        .eq('role', 'pm' as UserRole);
    const { data: pms, error: pmsError } = await pmsQuery;

    if (pmsError) {
        errorLog.push(`Fetching PMs: ${pmsError.message}`);
    } else if (pms !== null) { 
        // Assert type after checks, via unknown
        const pmData = pms as unknown as Array<{ id: string, full_name: string | null }>;
        const pmProjectCounts = await Promise.all(pmData.map(async (pm) => {
            const pmProjectQuery = buildProjectQuery(supabase, 'id')
                .in('status', WIP_STATUSES)
                .eq('pm_id', pm.id);
            const { count, error: countError } = await pmProjectQuery;

            if (countError) {
                errorLog.push(`Counting projects for PM ${pm.id}: ${countError.message}`);
                return { id: pm.id, name: pm.full_name, activeProjectCount: 0 };
            }
            return { id: pm.id, name: pm.full_name, activeProjectCount: count ?? 0 };
        }));
        keyPMs = pmProjectCounts;
    }

    // --- Final Aggregation ---
    if (errorLog.length > 0) {
        console.error("Errors fetching dashboard data:", errorLog);
        // Return partial data? Or null? Returning null if any critical error occurred.
        // Fine-tune error handling based on which data is critical.
        const criticalErrors = errorLog.some(e => e.startsWith('Revenue') || e.startsWith('WIP') || e.startsWith('Customers'));
        if (criticalErrors) {
             return { data: null, error: { message: `Errors fetching critical dashboard data: ${errorLog.join(', ')}`, details: '', hint:'', code: 'FETCH_ERROR' } as PostgrestError };
        }
    }

    const dashboardData: DashboardData = {
        summaryMetrics: {
            totalRevenue: { value: totalRevenueCurrent, trend: revenueTrend },
            newCustomers: { value: distinctCustomersCurrent, trend: customerTrend },
            wipProjects: { value: wipProjectsCurrent, trend: wipTrend },
            completedRevenue: completedRevenueMetric,
        },
        projectStatusDistribution,
        recentInvoices,
        activeProjects,
        keyPMs,
    };

    return { data: dashboardData, error: null };
}

// Example of a potential dedicated function if needed elsewhere
export async function getActiveProjects(filters: DashboardFilters = {}): Promise<{ data: ActiveProject[] | null; error: PostgrestError | null }> {
     const supabase = await supabaseServer();
     // Re-use buildProjectQuery logic here if desired
     const { data, error } = await supabase
        .from('projects')
        .select('id, name, status, client_company, end_date')
        .in('status', WIP_STATUSES); // Add filters here too
        // .gte('created_at', startDateISO) // Apply filters
        // ... other filters

     if (error) {
        console.error("Error fetching active projects:", error);
        return { data: null, error };
     }
     return { data, error: null };
} 