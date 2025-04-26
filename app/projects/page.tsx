'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjects, Project } from "@/lib/actions/projects";
import { ProjectDataTable } from "@/components/projects/ProjectDataTable";
import ProjectTimeSeriesChart from "@/components/projects/ProjectTimeSeriesChart";
import { Database, Enums } from "@/lib/types/supabase";
import { useSearchParams } from 'next/navigation';

// Helper function to aggregate project counts by month
function aggregateProjectsByMonth(projects: Project[]): { date: string; count: number }[] {
  if (!projects) return [];

  const counts = projects.reduce((acc, project) => {
    try {
      // Ensure created_at is valid before processing
      if (!project.created_at) return acc; 
      
      const date = new Date(project.created_at);
      // Get the year and month (YYYY-MM format for easy sorting)
      // Use UTC methods to avoid timezone issues in aggregation keys
      const monthKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
      
      acc[monthKey] = (acc[monthKey] || 0) + 1;
    } catch (e) {
        console.error(`Error processing date for project ${project.id}: ${project.created_at}`, e);
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert aggregated counts into the format expected by the chart
  // Sort by date ascending
  return Object.entries(counts)
    .map(([monthKey, count]) => ({ 
        // Convert YYYY-MM back to a full date string (e.g., start of the month) for the time scale
        date: `${monthKey}-01T00:00:00.000Z`, 
        count 
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function ProjectsClient() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Construct filters object from searchParams
      const filters = {
        name: searchParams.get('name') || undefined,
        status: searchParams.get('status') as Enums<"project_status"> || undefined,
        clientCompany: searchParams.get('client') as Enums<"client_company"> || undefined,
        projectNumber: searchParams.get('projectNumber') || undefined,
        projectType: searchParams.get('projectType') as Enums<"project_type_enum"> || undefined,
        siteAddress: searchParams.get('siteAddress') || undefined,
        clientPM: searchParams.get('clientPM') as Enums<"client_project_manager"> || undefined,
        foreman: searchParams.get('foreman') as Enums<"dehyl_foreman"> || undefined
      };

      const { projects: fetchedProjects, error: fetchError } = await getProjects(filters);
      
      if (fetchError) {
        setError(fetchError.message);
        setProjects(null);
      } else {
        setProjects(fetchedProjects);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Initial data fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading && !projects) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading projects: {error}</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No projects found.</div>; 
  }

  // Aggregate data for the time series chart
  const timeSeriesData = aggregateProjectsByMonth(projects);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Projects</h1>
      
      {/* Render the time series chart */}
      <ProjectTimeSeriesChart data={timeSeriesData} />

      {/* Pass projects (potentially filtered) to the data table */}
      <ProjectDataTable 
        data={projects} 
        onDataRefresh={fetchProjects}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return <ProjectsClient />;
} 