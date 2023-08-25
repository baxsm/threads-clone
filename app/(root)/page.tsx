import ThreadCard from "@/components/cards/ThreadCard";
import PostThread from "@/components/forms/PostThread";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const result = await fetchThreads(1, 30);

  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      {userInfo && userInfo._id && <PostThread userId={userInfo._id} />}
      <section className="mt-9 flex flex-col gap-8">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => {
              return (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || ""}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  createdAt={post.createdAt}
                  comments={post.children}
                  community={post.community}
                />
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}
