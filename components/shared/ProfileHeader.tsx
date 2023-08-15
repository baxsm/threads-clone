import Image from "next/image";
import { FC } from "react";

interface ProfileHeaderProps {
  accountId: string;
  authUserId: string;
  username: string;
  imgUrl: string;
  bio: string;
  name: string;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({
  bio,
  username,
  authUserId,
  imgUrl,
  accountId,
  name,
}) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 object-cover relative">
            <Image
              src={imgUrl}
              alt="profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
