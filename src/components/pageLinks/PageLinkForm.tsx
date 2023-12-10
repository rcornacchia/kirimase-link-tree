"use client";

import {
  PageLink,
  NewPageLinkParams,
  insertPageLinkParams,
} from "@/lib/db/schema/pageLinks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const PageLinkForm = ({
  pageLink,
  closeModal,
}: {
  pageLink?: PageLink;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  const { data: pages } = trpc.pages.getPages.useQuery();
  const editing = !!pageLink?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertPageLinkParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertPageLinkParams),
    defaultValues: pageLink ?? {
      title: "",
      url: "",
      pageId: 0,
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.pageLinks.getPageLinks.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Page Link ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createPageLink, isLoading: isCreating } =
    trpc.pageLinks.createPageLink.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updatePageLink, isLoading: isUpdating } =
    trpc.pageLinks.updatePageLink.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deletePageLink, isLoading: isDeleting } =
    trpc.pageLinks.deletePageLink.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewPageLinkParams) => {
    if (editing) {
      updatePageLink({ ...values, id: pageLink.id });
    } else {
      createPageLink(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Id</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages?.pages.map((page) => (
                      <SelectItem key={page.id} value={page.id.toString()}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

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
            onClick={() => deletePageLink({ id: pageLink.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default PageLinkForm;
