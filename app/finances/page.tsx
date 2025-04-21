import { getInvoiceData } from "@/lib/actions/invoices";
import { columns } from "@/components/finances/columns";
import { InvoiceDataTable } from "@/components/finances/InvoiceDataTable";
import SummaryCard from "@/components/dashboard/SummaryCard";

export default async function FinancesPage() {
  // Fetch combined invoice data and summary
  const { invoices, summary, error } = await getInvoiceData();

  if (error) {
    return <div className="text-red-500">Error loading finance data: {error.message}</div>;
  }

  if (!invoices) {
    // Handle case where invoices might be null even without an error
    return <div>Loading invoices... or no invoices found.</div>; 
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Finances</h1>

      {/* Summary Cards Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total Receivables"
            value={summary.totalReceivables}
            description="Unpaid & Not Cancelled"
            formatAsCurrency={true}
        />
        <SummaryCard 
            title="Current Amount"
            value={summary.totalCurrent}
            description="Receivable & Not Overdue"
            formatAsCurrency={true}
        />
        <SummaryCard 
            title="Overdue Amount"
            value={summary.totalOverdue}
            description="Receivable & Past Due Date"
            formatAsCurrency={true}
        />
      </div>

        {/* Invoice Table Title */}    
      <h2 className="text-xl font-semibold">Invoices</h2>

      {/* Invoice Table */}
      <InvoiceDataTable 
        columns={columns} 
        data={invoices} 
        filterColumnId="invoice_number" 
        filterPlaceholder="Filter by Invoice #..."
      />
    </div>
  );
} 