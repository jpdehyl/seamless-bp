'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter, 
    DialogDescription, 
    DialogClose
} from "@/components/ui/dialog";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Project, updateProject, UpdateProjectPayload } from '@/lib/actions/projects';
import { Constants, Enums } from '@/lib/types/supabase';

// Zod schema for the form
const EditProjectFormSchema = z.object({
    name: z.string().min(1, "Project name is required."),
    client_company: z.enum(Constants.public.Enums.client_company).nullable(),
    project_number: z.string().nullable().optional(),
    site_address: z.string().nullable().optional(),
    start_date: z.date().nullable().optional(),
    end_date: z.date().nullable().optional(),
    status: z.enum(Constants.public.Enums.project_status).nullable(),
    revenue: z.coerce.number().nullable().optional(),
    costs: z.coerce.number().nullable().optional(),
    margin: z.coerce.number().nullable().optional(),
    project_type: z.enum(Constants.public.Enums.project_type_enum).nullable().optional(),
    client_project_manager: z.enum(Constants.public.Enums.client_project_manager).nullable().optional(),
    dehyl_foreman: z.enum(Constants.public.Enums.dehyl_foreman).nullable().optional(),
    po_number: z.string().nullable().optional(),
    basic_scope_of_work: z.string().nullable().optional(),
});

// Type for form values
type EditProjectFormValues = z.infer<typeof EditProjectFormSchema>;

interface ProjectEditModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: (updated?: boolean) => void;
}

export function ProjectEditModal({ project, isOpen, onClose }: ProjectEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(EditProjectFormSchema),
    defaultValues: {
        name: project?.name ?? '',
        client_company: project?.client_company ?? null,
        project_number: project?.project_number ?? null,
        site_address: project?.site_address ?? null,
        start_date: project?.start_date ? new Date(project.start_date) : null,
        end_date: project?.end_date ? new Date(project.end_date) : null,
        status: project?.status ?? null,
        revenue: project?.revenue ?? null,
        costs: project?.costs ?? null,
        margin: project?.margin ?? null,
        project_type: project?.project_type ?? null,
        client_project_manager: project?.client_project_manager ?? null,
        dehyl_foreman: project?.dehyl_foreman ?? null,
        po_number: project?.po_number ?? null,
        basic_scope_of_work: project?.basic_scope_of_work ?? null,
    },
  });

  // Reset form when project data changes
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name ?? '',
        client_company: project.client_company ?? null,
        project_number: project.project_number ?? null,
        site_address: project.site_address ?? null,
        start_date: project.start_date ? new Date(project.start_date) : null,
        end_date: project.end_date ? new Date(project.end_date) : null,
        status: project.status ?? null,
        revenue: project.revenue ?? null,
        costs: project.costs ?? null,
        margin: project.margin ?? null,
        project_type: project.project_type ?? null,
        client_project_manager: project.client_project_manager ?? null,
        dehyl_foreman: project.dehyl_foreman ?? null,
        po_number: project.po_number ?? null,
        basic_scope_of_work: project.basic_scope_of_work ?? null,
      });
    } else {
        form.reset(); // Reset to default if no project
    }
  }, [project, form]);

  // Handle form submission
  const onSubmit = async (values: EditProjectFormValues) => {
    if (!project) return;

    setIsSubmitting(true);
    try {
      // Prepare payload for the server action
      const payload: UpdateProjectPayload = {
        name: values.name,
        client_company: values.client_company === null ? undefined : values.client_company,
        // Only include fields actually in the UpdateProjectPayload type
        status: values.status === null ? undefined : values.status,
        revenue: values.revenue === null ? null : values.revenue,
        start_date: values.start_date instanceof Date ? values.start_date.toISOString().split('T')[0] : undefined,
        end_date: values.end_date instanceof Date ? values.end_date.toISOString().split('T')[0] : undefined,
      };
      
      // Add additional fields if they exist in the Project model
      if (values.project_number !== null) {
        (payload as any).project_number = values.project_number;
      }
      if (values.site_address !== null) {
        (payload as any).site_address = values.site_address;
      }
      if (values.costs !== null) {
        (payload as any).costs = values.costs;
      }
      if (values.margin !== null) {
        (payload as any).margin = values.margin;
      }
      if (values.project_type !== null) {
        (payload as any).project_type = values.project_type;
      }
      if (values.client_project_manager !== null) {
        (payload as any).client_project_manager = values.client_project_manager;
      }
      if (values.dehyl_foreman !== null) {
        (payload as any).dehyl_foreman = values.dehyl_foreman;
      }
      if (values.po_number !== null) {
        (payload as any).po_number = values.po_number;
      }
      if (values.basic_scope_of_work !== null) {
        (payload as any).basic_scope_of_work = values.basic_scope_of_work;
      }

      const result = await updateProject(project.id, payload);

      if (result.success) {
        toast.success("Project updated successfully!");
        onClose(true); // Close modal and indicate update was successful
      } else {
        toast.error("Failed to update project", { 
            description: result.error?.message || "An unknown error occurred." 
        });
      }
    } catch (error) {
      console.error("Error submitting project update:", error);
      toast.error("An unexpected error occurred while updating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get enum values for dropdowns
  const projectStatuses = Constants.public.Enums.project_status ?? [];
  const clientCompanies = Constants.public.Enums.client_company ?? [];
  const projectTypes = Constants.public.Enums.project_type_enum ?? [];
  const clientPMs = Constants.public.Enums.client_project_manager ?? [];
  const foremen = Constants.public.Enums.dehyl_foreman ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}> 
      <DialogContent className="sm:max-w-[700px] bg-background border rounded-lg shadow-lg" style={{ backgroundColor: "var(--background)", backdropFilter: "blur(10px)" }}>
        <DialogHeader>
          <DialogTitle>Edit Project: {project?.name}</DialogTitle>
          <DialogDescription>
            Make changes to the project details below. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
            {/* Left column */}
            <div className="space-y-4">
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Company */}
              <FormField
                control={form.control}
                name="client_company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientCompanies.map(client => (
                            <SelectItem key={client} value={client}>{client}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Number */}
              <FormField
                control={form.control}
                name="project_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project number" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Site Address */}
              <FormField
                control={form.control}
                name="site_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter site address" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Type */}
              <FormField
                control={form.control}
                name="project_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Revenue */}
              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter revenue amount" 
                        {...field} 
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Costs */}
              <FormField
                control={form.control}
                name="costs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costs</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter costs amount" 
                        {...field} 
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Margin */}
              <FormField
                control={form.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Enter margin percentage" 
                        {...field} 
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Project Manager */}
              <FormField
                control={form.control}
                name="client_project_manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client PM</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client PM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientPMs.map(pm => (
                            <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Foreman */}
              <FormField
                control={form.control}
                name="dehyl_foreman"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foreman</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select foreman" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {foremen.map(foreman => (
                            <SelectItem key={foreman} value={foreman}>{foreman}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PO Number */}
              <FormField
                control={form.control}
                name="po_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter PO number" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full width items */}
            <div className="col-span-2 space-y-4">
              {/* Basic Scope of Work */}
              <FormField
                control={form.control}
                name="basic_scope_of_work"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope of Work</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter basic scope of work" 
                        className="min-h-[100px]"
                        {...field} 
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => onClose()}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 