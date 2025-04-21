'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { Database } from '@/lib/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

type ProjectStatus = Database['public']['Enums']['project_status'];

// Define the statuses that represent 'Work in Progress'
const WIP_STATUSES: ProjectStatus[] = ['in progress']; // Confirm if other statuses should be included

interface Metric {
  value: number;
  trend: number | null; // Trend as a percentage change, null if not applicable or calculable
}

interface DashboardMetrics {
  totalRevenue: Metric;
  newCustomers: Metric;
  wipProjects: Metric;
}

// Helper function to calculate percentage change
function calculateTrend(current: number, previous: number): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Assign 100% increase if previous was 0 and current is positive
  }
  return Math.round(((current - previous) / previous) * 100);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await supabaseServer();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const sixtyDaysAgoISO = sixtyDaysAgo.toISOString();

  let errorLog: PostgrestError[] = [];

  // --- Total Revenue --- 
  const { data: revenueDataCurrent, error: revenueErrorCurrent } = await supabase
    .from('projects')
    .select('revenue')
    .gte('created_at', thirtyDaysAgoISO);
  if (revenueErrorCurrent) errorLog.push(revenueErrorCurrent);
  const totalRevenueCurrent = revenueDataCurrent?.reduce((sum, p) => sum + (p.revenue ?? 0), 0) ?? 0;

  const { data: revenueDataPrevious, error: revenueErrorPrevious } = await supabase
    .from('projects')
    .select('revenue')
    .gte('created_at', sixtyDaysAgoISO)
    .lt('created_at', thirtyDaysAgoISO);
  if (revenueErrorPrevious) errorLog.push(revenueErrorPrevious);
  const totalRevenuePrevious = revenueDataPrevious?.reduce((sum, p) => sum + (p.revenue ?? 0), 0) ?? 0;
  const revenueTrend = calculateTrend(totalRevenueCurrent, totalRevenuePrevious);

  // --- New Customers (Client Companies) ---
  const { data: customerDataCurrent, error: customerErrorCurrent } = await supabase
    .from('projects')
    .select('client_company', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgoISO);
  if (customerErrorCurrent) errorLog.push(customerErrorCurrent);
  const newCustomersCurrent = customerDataCurrent?.length ?? 0; // Assuming distinct count needs more complex logic or view
  // Note: Supabase count on select might not be distinct. A view or function might be better for exact distinct count.
  // Fetching all and counting distinct in code for now, which is inefficient for large datasets.
  const { data: allCustomersCurrent, error: allCustErrorCurr } = await supabase
    .from('projects')
    .select('client_company')
    .gte('created_at', thirtyDaysAgoISO);
  const distinctCustomersCurrent = new Set(allCustomersCurrent?.map(p => p.client_company).filter(Boolean)).size;

  const { data: allCustomersPrevious, error: allCustErrorPrev } = await supabase
    .from('projects')
    .select('client_company')
    .gte('created_at', sixtyDaysAgoISO)
    .lt('created_at', thirtyDaysAgoISO);
  const distinctCustomersPrevious = new Set(allCustomersPrevious?.map(p => p.client_company).filter(Boolean)).size;
  const customerTrend = calculateTrend(distinctCustomersCurrent, distinctCustomersPrevious);

  // --- Work in Progress Projects ---
  const { count: wipCountCurrent, error: wipErrorCurrent } = await supabase
    .from('projects')
    .select('*' , { count: 'exact', head: true })
    .in('status', WIP_STATUSES);
  if (wipErrorCurrent) errorLog.push(wipErrorCurrent);
  const wipProjectsCurrent = wipCountCurrent ?? 0;

  // Trend for WIP projects is complex as status changes over time.
  // A simpler approach: Count projects created in the previous 30 days that ended up in WIP status?
  // Or count projects that were WIP 30 days ago? Requires historical tracking not directly available. 
  // For now, omitting WIP trend until a clearer logic is defined.
  const wipTrend = null; // Omitting WIP trend for now

  // Log any errors
  if (errorLog.length > 0) {
    console.error("Errors fetching dashboard metrics:", errorLog);
  }

  return {
    totalRevenue: { value: totalRevenueCurrent, trend: revenueTrend },
    newCustomers: { value: distinctCustomersCurrent, trend: customerTrend }, // Using distinct count
    wipProjects: { value: wipProjectsCurrent, trend: wipTrend },
  };
} 