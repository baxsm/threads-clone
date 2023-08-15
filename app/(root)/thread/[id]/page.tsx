import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return;
  }
  
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div className="">
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
          community={thread.community}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={JSON.stringify(thread._id)}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((childItem: any) => {
          return (
            <ThreadCard
              key={childItem._id}
              id={childItem._id}
              currentUserId={childItem?.id || ""}
              parentId={childItem.parentId}
              content={childItem.text}
              author={childItem.author}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              community={childItem.community}
              isComment
            />
          );
        })}
      </div>
    </section>
  );
};

export default Page;
