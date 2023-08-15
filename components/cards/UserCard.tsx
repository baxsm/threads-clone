"use client";

import Image from "next/image";
import { FC } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard: FC<UserCardProps> = ({
  id,
  imgUrl,
  name,
  personType,
  username,
}) => {
  const router = useRouter();
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="w-[48px] h-[48px] relative">
          <Image src={imgUrl} alt="logo" fill className="rounded-full" />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      <Button
        className="user-card_btn"
        onClick={() => router.push(`/profile/${id}`)}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
