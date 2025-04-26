'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

// Import actions and types
import {
  fetchProjects,
  addTimecard,
  Timecard,
  Project,
} from '@/lib/actions/timecards';

// Define Zod schema based on actual timecards table columns needed for insertion
const formSchema = z.object({
  worker_name: z.string().min(1, 'Worker name is required'),
  date: z.date({ required_error: "A date is required." }),
  hours: z.coerce.number().positive('Hours must be positive'),
  wage_per_hour: z.coerce.number().positive('Wage rate must be positive'),
  project: z.string().min(1, 'Project is required'), // Store project name as text
  // Add other required fields if any (e.g., period)
  period: z.string().optional(),
  // Optional fields can be added here too
  total_pay: z.coerce.number().optional(),
  balance_owed: z.coerce.number().optional(),
  payment_amount: z.coerce.number().optional(),
  payment_date: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TimecardModalProps {
  children: React.ReactNode; // To wrap the trigger button
  mode: 'add';
} // Extend later for 'edit' mode if needed

export function TimecardModal({ children, mode }: TimecardModalProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  // Fetch active projects for the dropdown
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', 'active'],
    queryFn: () => fetchProjects(false), // false = only active projects
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      worker_name: '',
      date: new Date(),
      hours: 0,
      wage_per_hour: 0,
      project: '',
      period: '',
      // Optional fields default to undefined
    },
  });

  // --- Mutation --- (For adding timecard)
  const mutation = useMutation({
    mutationFn: addTimecard,
    onSuccess: (data) => {
      if (data.error) {
        throw new Error(data.error instanceof Error ? data.error.message : String(data.error));
      }
      toast.success("Timecard added successfully.");
      queryClient.invalidateQueries({ queryKey: ['timecards'] }); // Refetch timecards list
      setOpen(false); // Close modal on success
      form.reset(); // Reset form
    },
    onError: (error) => {
      console.error("Error adding timecard:", error);
      toast.error("Failed to add timecard", {
          description: error.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

  // --- Submit Handler ---
  function onSubmit(values: FormData) {
    // Format date and payment_date to YYYY-MM-DD string before sending
    const formattedValues = {
      ...values,
      date: format(values.date, 'yyyy-MM-dd'),
      payment_date: values.payment_date ? format(values.payment_date, 'yyyy-MM-dd') : null,
    };
    mutation.mutate(formattedValues);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Timecard' : 'Edit Timecard'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Fill in the details for the new timecard.' : 'Update the timecard details.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Worker Name */}
            <FormField
              control={form.control}
              name="worker_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Worker Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* Hours */}
                <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.1" placeholder="8" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Wage Per Hour */}
                <FormField
                control={form.control}
                name="wage_per_hour"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rate ($/hr)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" placeholder="25.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

             {/* Project */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingProjects}>
                     <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingProjects ? "Loading..." : "Select a project"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectsData?.data?.map((proj) => (
                        <SelectItem key={proj.id} value={proj.name}> {/* Store project NAME */}
                          {proj.name}
                           {proj.client_company && <span className='text-xs text-muted-foreground ml-2'>({proj.client_company})</span>}
                        </SelectItem>
                      ))}
                     </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Period (Optional) */}
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period <span className='text-muted-foreground text-xs'>(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Week 1" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add other optional fields here if needed (total_pay, payment_date etc.) */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Timecard'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 