"use client";

import { Scan, NewScanParams, insertScanParams } from "@/lib/db/schema/scans";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const ScanForm = ({
  scan,
  closeModal,
}: {
  scan?: Scan;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!scan?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertScanParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertScanParams),
    defaultValues: scan ?? {
      responseBody: "",
     responseStatusCode: 0,
     isAvailable: false,
     createdAt: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.scans.getScans.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Scan ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createScan, isLoading: isCreating } =
    trpc.scans.createScan.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateScan, isLoading: isUpdating } =
    trpc.scans.updateScan.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteScan, isLoading: isDeleting } =
    trpc.scans.deleteScan.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewScanParams) => {
    if (editing) {
      updateScan({ ...values, id: scan.id });
    } else {
      createScan(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="responseBody"
          render={({ field }) => (<FormItem>
              <FormLabel>Response Body</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responseStatusCode"
          render={({ field }) => (<FormItem>
              <FormLabel>Response Status Code</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (<FormItem>
              <FormLabel>Is Available</FormLabel>
                <br />
            <FormControl>
              <Checkbox {...field} checked={!!field.value} onCheckedChange={field.onChange} value={""} />
            </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (<FormItem>
              <FormLabel>Created At</FormLabel>
                <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
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
                    selected={new Date(field.value)}
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
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteScan({ id: scan.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default ScanForm;
