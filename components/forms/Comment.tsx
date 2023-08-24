"use client";

import { ChangeEvent, FC, useState } from "react";
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
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import { commentSchema } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import Image from "next/image";
interface CommentProps {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment: FC<CommentProps> = ({
  threadId,
  currentUserId,
  currentUserImg,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    await addCommentToThread(threadId, values.thread, currentUserId, pathname);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <div className="h-[48px] w-[48px] relative">
                  <Image
                    src={currentUserImg}
                    alt="profile image"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment ..."
                  {...field}
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
