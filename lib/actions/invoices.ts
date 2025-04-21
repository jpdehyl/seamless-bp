'use server';

import { supabaseServer } from '@/lib/supabase/server';
import { Database } from '@/lib/types/supabase'; // Import base types
import { PostgrestError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Manually define the Invoice type based on known schema & generated Enums
// because type generator missed some columns in the table definition.
export type Invoice = {
    id: string;
    created_at: string;
    date_issued: string | null;
    due_date: string | null;
    invoice_amount: number;
    invoice_number: string;
    project_id: string; // Assuming UUID foreign key
    client_id: string; // Assuming UUID or code, adjust if needed
    invoice_status: Database["public"]["Enums"]["invoice_status"] | null;
    payment_status: Database["public"]["Enums"]["payment_status"] | null;
    payment_terms: Database["public"]["Enums"]["payment_terms"] | null;
    payment_method: Database["public"]["Enums"]["payment_method"] | null;
    // Add related data if joining, e.g.:
    // projects?: { name: string; project_number: string };
    // clients?: { client_company: string; client_code: string };
};

// Define summary metrics structure
interface FinanceSummary {
    totalReceivables: number;
    totalOverdue: number;
    totalCurrent: number;
}

// Updated function to return both invoices and summary
export async function getInvoiceData(): Promise<{
    invoices: Invoice[] | null;
    summary: FinanceSummary;
    error: PostgrestError | null;
}> {
    const supabase = await supabaseServer();
    const today = new Date();

    // Fetch all relevant invoices first
    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('date_issued', { ascending: false });

    if (error) {
        console.error("Error fetching invoices:", error);
        return {
            invoices: null,
            summary: { totalReceivables: 0, totalOverdue: 0, totalCurrent: 0 },
            error,
        };
    }

    const invoices = data as Invoice[]; // Type assertion needed

    // Calculate summary metrics
    let totalReceivables = 0;
    let totalOverdue = 0;

    invoices.forEach(inv => {
        // Consider receivable if not paid and not cancelled
        if (inv.payment_status === 'Not paid' && inv.invoice_status !== 'Cancelled') {
            totalReceivables += inv.invoice_amount;
            
            // Check if overdue
            if (inv.due_date && new Date(inv.due_date) < today) {
                totalOverdue += inv.invoice_amount;
            }
        }
    });

    const totalCurrent = totalReceivables - totalOverdue;
    const summary: FinanceSummary = { totalReceivables, totalOverdue, totalCurrent };

    return { invoices, summary, error: null };
}

// Action to update a specific invoice field
export async function updateInvoiceField(
    invoiceId: string,
    field: keyof Invoice, // Use our manually defined type
    value: any
): Promise<{ success: boolean; error: PostgrestError | null }> {
    const supabase = await supabaseServer();

    if (!invoiceId || !field) {
        console.error("Missing invoiceId or field for update");
        return { success: false, error: { message: "Invalid input", details: "", hint: "", code: "" } as PostgrestError };
    }

    const { error } = await supabase
        .from('invoices')
        .update({ [field]: value })
        .eq('id', invoiceId);

    if (error) {
        console.error(`Error updating invoice ${field}:`, error);
        return { success: false, error };
    }

    revalidatePath('/finances');
    return { success: true, error: null };
} 