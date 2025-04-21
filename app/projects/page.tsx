import { getProjects, Project } from "@/lib/actions/projects";
import { columns } from "@/components/projects/columns";
import { ProjectDataTable } from "@/components/projects/ProjectDataTable";

export default async function ProjectsPage() {
  // Fetch initial project data
  const { projects, error } = await getProjects();

  if (error) {
    // Handle error state appropriately - maybe show an error message
    return <div className="text-red-500">Error loading projects: {error.message}</div>;
  }

  if (!projects) {
    // Handle case where projects might be null even without an error
    return <div>Loading projects... or no projects found.</div>; 
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ProjectDataTable columns={columns} data={projects} />
    </div>
  );
} 