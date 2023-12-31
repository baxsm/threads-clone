import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineSend,
} from "react-icons/ai";

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  isComment?: boolean;
}

const ThreadCard: FC<ThreadCardProps> = ({
  id,
  currentUserId,
  parentId,
  author,
  comments,
  content,
  createdAt,
  community,
  isComment,
}) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt={"profile image"}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`mt-5 flex flex-col gap-3 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5">
                <Link
                  href={"#"}
                  className="hover:bg-gray-400/20 text-gray-600 hover:text-gray-400 p-2 rounded-xl"
                >
                  <AiOutlineHeart size={20} />
                </Link>
                <Link
                  href={`/thread/${id}`}
                  className="hover:bg-gray-400/20 text-gray-600 hover:text-gray-400 p-2 rounded-xl"
                >
                  <AiOutlineComment size={20} />
                </Link>
                <Link
                  href={"#"}
                  className="hover:bg-gray-400/20 text-gray-600 hover:text-gray-400 p-2 rounded-xl"
                >
                  <AiOutlineShareAlt size={20} />
                </Link>
                <Link
                  href={"#"}
                  className="hover:bg-gray-400/20 text-gray-600 hover:text-gray-400 p-2 rounded-xl"
                >
                  <AiOutlineSend size={20} />
                </Link>
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
