import { getDashboardMetrics } from "@/lib/actions/dashboard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default async function DashboardPage() {
    // Fetch data server-side
    const metrics = await getDashboardMetrics();

    // Define descriptions for the cards based on the image
    const revenueDescription = "Trending up this month"; // Placeholder, adjust if needed
    const customerDescription = "Down 20% this period"; // Placeholder, adjust if needed
    const wipDescription = "Projects currently active"; // Placeholder, adjust if needed

  return (
    <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Summary Cards Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard 
            title="Total Revenue" 
            value={metrics.totalRevenue.value}
            trend={metrics.totalRevenue.trend}
            description={revenueDescription}
            formatAsCurrency={true}
        />
        <SummaryCard 
            title="New Customers" 
            value={metrics.newCustomers.value}
            trend={metrics.newCustomers.trend}
            description={customerDescription}
        />
        <SummaryCard 
            title="Work In Progress" 
            value={metrics.wipProjects.value}
            trend={metrics.wipProjects.trend} // Currently null
            description={wipDescription}
        />
      </div>

      {/* Tabs Section */}
      <div>
        <DashboardTabs />
      </div>

    </div>
  );
} 