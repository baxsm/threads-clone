"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

type CreateThreadTypes = {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
};

export async function createThread({
  author,
  communityId,
  path,
  text,
}: CreateThreadTypes) {
  connectToDB();
  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread ${error.message}`);
  }
}

type FetchThreadsTypes = {
  pageNumber?: number;
  pageSize?: number;
};

export async function fetchThreads({
  pageNumber = 1,
  pageSize = 20,
}: FetchThreadsTypes) {
  connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const postQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({
        createdAt: "desc",
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching threads ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread ${error.message}`);
  }
}

type AddCommentTypes = {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
};

export async function addCommentToThread({
  commentText,
  path,
  threadId,
  userId,
}: AddCommentTypes) {
  connectToDB();
  try {
    const originalThread = await Thread.findById(JSON.parse(threadId));

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: JSON.parse(userId),
      parentId: JSON.parse(threadId),
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error publishing comment ${error.message}`);
  }
}
