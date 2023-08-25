"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { threadSchema } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";

interface PostThreadProps {
  userId: string;
}

const PostThread: FC<PostThreadProps> = ({ userId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof threadSchema>>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof threadSchema>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    form.reset();
    router.push("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-8">
        <div className="p-4 flex flex-col gap-4 bg-dark-3 rounded-2xl">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormControl className="no-focus border border-dark-4 bg-dark-2 text-light-1">
                  <Textarea {...field} className="min-h-[120px] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-between">
            <div className="actions"></div>
            <Button className="bg-primary-500">Post</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PostThread;
