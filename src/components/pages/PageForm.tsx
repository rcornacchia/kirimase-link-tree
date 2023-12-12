"use client";

import { Page, NewPageParams, insertPageParams } from "@/lib/db/schema/pages";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const PageForm = ({
  page,
  closeModal,
}: {
  page?: Page;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const { data: sub } = trpc.account.getSubscription.useQuery();
  const editing = !!page?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertPageParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertPageParams),
    defaultValues: page ?? {
      title: "",
      description: "",
      public: false,
      slug: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.pages.getPages.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Page ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createPage, isLoading: isCreating } =
    trpc.pages.createPage.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updatePage, isLoading: isUpdating } =
    trpc.pages.updatePage.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deletePage, isLoading: isDeleting } =
    trpc.pages.deletePage.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewPageParams) => {
    if (editing) {
      updatePage({ ...values, id: page.id });
    } else {
      createPage(values);
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="public"
          disabled={sub?.isSubscribed === false ?? false}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public</FormLabel>
              <br />
              <FormControl>
                <Checkbox
                  {...field}
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  value={""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
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
            onClick={() => deletePage({ id: page.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default PageForm;
