"use client";

import Image from "next/image";
import type { GitHubUser } from "@/types/github";
import { UI_TEXTS } from "@/constants/ui-texts";

/**
 * Props for UserCard component
 */
export interface UserCardProps {
  /**
   * GitHub user data to display
   */
  user: GitHubUser;
  /**
   * Callback function called when user card is clicked
   * @param user - The clicked user data
   */
  onClick: (user: GitHubUser) => void;
}

/**
 * UserCard component displays basic user information
 * Clicking the card triggers the onClick callback to open user details
 */
export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const handleClick = () => {
    onClick(user);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(user);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flex cursor-pointer items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-400"
      aria-label={UI_TEXTS.userCard.viewDetailsAriaLabel(user.login)}
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={user.avatar_url}
          alt={UI_TEXTS.userCard.avatarAlt(user.login)}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {user.login}
        </h3>
        {user.name && (
          <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
            {user.name}
          </p>
        )}
        {user.bio && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-500">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
};

