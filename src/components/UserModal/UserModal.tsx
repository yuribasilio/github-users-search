"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import type { GitHubUser } from "@/types/github";

/**
 * Props for UserModal component
 */
export interface UserModalProps {
  /**
   * GitHub user data to display in the modal
   */
  user: GitHubUser | null;
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback function called when modal should be closed
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Whether user details are being loaded
   */
  isLoading?: boolean;
}

/**
 * UserModal component displays detailed user information in a modal dialog
 * Uses Radix UI Dialog for accessibility and keyboard navigation
 */
export const UserModal: React.FC<UserModalProps> = ({
  user,
  open,
  onOpenChange,
  isLoading = false,
}) => {
  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) {
      return "0";
    }
    return value.toLocaleString();
  };

  const SkeletonText = ({ className = "" }: { className?: string }) => (
    <div
      className={`h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 ${className}`}
      aria-hidden="true"
    />
  );

  const SkeletonAvatar = () => (
    <div
      className="h-24 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"
      aria-hidden="true"
    />
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Description className="sr-only">
            Detailed information about GitHub user {user.login}
          </Dialog.Description>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-6">
              {isLoading ? (
                <SkeletonAvatar />
              ) : (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={user.avatar_url}
                    alt={`${user.login} avatar`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Dialog.Title className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {isLoading ? (
                    <span className="sr-only">Loading user details</span>
                  ) : (
                    user.login
                  )}
                </Dialog.Title>
                {isLoading ? (
                  <>
                    <SkeletonText className="mb-2 mt-1 h-5 w-24" />
                    <SkeletonText className="h-4 w-full" />
                    <SkeletonText className="mt-1 h-4 w-3/4" />
                  </>
                ) : (
                  <>
                    {user.name && (
                      <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
                        {user.name}
                      </p>
                    )}
                    {user.bio && (
                      <p className="mt-2 text-zinc-700 dark:text-zinc-300">{user.bio}</p>
                    )}
                  </>
                )}
              </div>
              <Dialog.Close
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                aria-label="Close dialog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Dialog.Close>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {isLoading ? (
                <>
                  {[...Array(9)].map((_, index) => (
                    <div key={index}>
                      <SkeletonText className="mb-2 h-4 w-20" />
                      <SkeletonText className="h-5 w-24" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {user.location && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Location
                      </p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-50">{user.location}</p>
                    </div>
                  )}
                  {user.company && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Company
                      </p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-50">{user.company}</p>
                    </div>
                  )}
                  {user.blog && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Website
                      </p>
                      <a
                        href={user.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {user.blog}
                      </a>
                    </div>
                  )}
                  {user.twitter_username && (
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Twitter
                      </p>
                      <a
                        href={`https://twitter.com/${user.twitter_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        @{user.twitter_username}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Followers
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {formatNumber(user.followers)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Following
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {formatNumber(user.following)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Public Repos
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {formatNumber(user.public_repos)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Public Gists
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {formatNumber(user.public_gists)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Member Since
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Dialog.Close
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600"
              >
                Close
              </Dialog.Close>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

