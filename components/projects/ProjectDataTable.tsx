'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  TableMeta
} from '@tanstack/react-table';
import { ArrowUpDown } from "lucide-react";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Project, getProjects } from "@/lib/actions/projects";
import { ProjectEditModal } from "./ProjectEditModal";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Constants, Enums } from '@/lib/types/supabase';
import { cn } from "@/lib/utils";
import { columns as projectColumns } from "./columns";

interface CustomTableMeta extends TableMeta<any> {
  handleEditClick?: (project: Project) => void;
}

interface DataTableProps<TData extends Project, TValue> {
  data: TData[];
  onDataRefresh?: () => void;
}

export function ProjectDataTable<TData extends Project, TValue>({
  data,
  onDataRefresh,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get all the initial filter values from URL
  const initialNameFilter = searchParams.get('name') ?? '';
  const initialStatusFilter = searchParams.get('status') ?? 'all';
  const initialClientFilter = searchParams.get('clientCompany') ?? '';
  const initialProjectNumberFilter = searchParams.get('projectNumber') ?? '';
  const initialProjectTypeFilter = searchParams.get('projectType') ?? 'all';
  const initialSiteAddressFilter = searchParams.get('siteAddress') ?? '';
  const initialClientPMFilter = searchParams.get('clientPM') ?? 'all';
  const initialForemanFilter = searchParams.get('foreman') ?? 'all';

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [projectToEdit, setProjectToEdit] = React.useState<Project | null>(null);
  const [tableData, setTableData] = React.useState<TData[]>(data);

  // Update the tableData when the props data changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleEditClick = React.useCallback((project: Project) => {
    console.log("Editing project:", project);
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(async (updated = false) => {
    setIsEditModalOpen(false);
    setProjectToEdit(null);
    
    // If the project was updated, call the refresh callback provided by the parent
    if (updated && onDataRefresh) {
      onDataRefresh();
    }
  }, [onDataRefresh]);

  // Get enum values for dropdowns
  const projectStatuses = Constants.public.Enums.project_status?.slice() ?? [];
  const clientCompanies = Constants.public.Enums.client_company?.slice() ?? [];
  const projectTypes = Constants.public.Enums.project_type_enum?.slice() ?? [];
  const clientPMs = Constants.public.Enums.client_project_manager?.slice() ?? [];
  const foremen = Constants.public.Enums.dehyl_foreman?.slice() ?? [];

  // Use only the columns from the imported file
  const allColumns = React.useMemo(() => 
    projectColumns as ColumnDef<TData, any>[], 
  []);

  // Define initial column visibility - hide margin, client PM and foreman
  const initialColumnVisibility: VisibilityState = {
    margin: false,
    client_project_manager: false,
    dehyl_foreman: false,
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);
  
  // Debug state for column visibility toggle
  const [visibilityOpen, setVisibilityOpen] = React.useState(false);

  const table = useReactTable<TData>({
    data: tableData,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    meta: {
      handleEditClick
    } as CustomTableMeta,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: initialColumnVisibility,
    }
  });

  const handleFilterChange = React.useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === 'all') {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    current.delete('pageIndex');

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [searchParams, pathname, router]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 py-4">
        {/* Filters with shorter placeholders */}
        <Input
          placeholder="Client"
          defaultValue={initialClientFilter}
          onChange={(event) => handleFilterChange('clientCompany', event.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Project Name"
          defaultValue={initialNameFilter}
          onChange={(event) => handleFilterChange('name', event.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Project #"
          defaultValue={initialProjectNumberFilter}
          onChange={(event) => handleFilterChange('projectNumber', event.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Site Address"
          defaultValue={initialSiteAddressFilter}
          onChange={(event) => handleFilterChange('siteAddress', event.target.value)}
          className="max-w-[150px]"
        />
        <Select 
          value={initialStatusFilter}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-auto min-w-[120px]"> 
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(projectStatuses as string[]).map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={initialProjectTypeFilter}
          onValueChange={(value) => handleFilterChange('projectType', value)}
        >
          <SelectTrigger className="w-auto min-w-[120px]"> 
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(projectTypes as string[]).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={initialClientPMFilter}
          onValueChange={(value) => handleFilterChange('clientPM', value)}
        >
          <SelectTrigger className="w-auto min-w-[120px]"> 
            <SelectValue placeholder="Client PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Client PMs</SelectItem>
            {(clientPMs as string[]).map(pm => (
              <SelectItem key={pm} value={pm}>{pm}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={initialForemanFilter}
          onValueChange={(value) => handleFilterChange('foreman', value)}
        >
          <SelectTrigger className="w-auto min-w-[120px]"> 
            <SelectValue placeholder="Foreman" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Foremen</SelectItem>
            {(foremen as string[]).map(foreman => (
              <SelectItem key={foreman} value={foreman}>{foreman}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Fixed visibility toggle */}
        <div className="ml-auto">
          <DropdownMenu open={visibilityOpen} onOpenChange={setVisibilityOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                        console.log("Column visibility changed:", column.id, value);
                      }}
                    >
                      {typeof column.columnDef.header === 'string' 
                        ? column.columnDef.header 
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-2 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : (
                          <Button
                              variant="ghost"
                              onClick={header.column.getToggleSortingHandler()}
                              className={cn(
                                  "w-full justify-start px-0 hover:bg-transparent font-medium data-[state=selected]:bg-transparent",
                                  header.column.getCanSort() ? "cursor-pointer select-none" : "cursor-default"
                              )}
                              disabled={!header.column.getCanSort()}
                          >
                              {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                              {
                                ({
                                    asc: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />,
                                    desc: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />,
                                }[header.column.getIsSorted() as string]) ?? 
                                (header.column.getCanSort() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-20" /> : null)
                              }
                          </Button>
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="rows-per-page">Rows per page</Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id="rows-per-page" className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 text-sm text-muted-foreground text-center">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <ProjectEditModal 
        project={projectToEdit} 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModal}
      />
      <Toaster richColors />
    </div>
  );
} 