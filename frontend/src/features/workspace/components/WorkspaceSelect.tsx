"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useLogoutMutation } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWorkspacesQuery } from "../hooks";
import type { WorkspaceResponse } from "../types";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

// Deterministic accent color per workspace, mirroring the mockup's colored icons.
const ICON_COLORS = ["bg-indigo-600", "bg-emerald-600", "bg-amber-500", "bg-violet-600"];

function iconColorOf(workspace: WorkspaceResponse): string {
  return ICON_COLORS[workspace.id % ICON_COLORS.length];
}

function WorkspaceCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-zinc-200 p-[18px]">
      <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-100" />
      <div className="flex-1">
        <div className="mb-2 h-3 w-[70%] animate-pulse rounded bg-zinc-100" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}

export function WorkspaceSelect() {
  const router = useRouter();
  const { data: workspaces, isPending, error } = useWorkspacesQuery();
  const logout = useLogoutMutation();
  const [modalOpen, setModalOpen] = useState(false);

  // The list is only readable when signed in - bounce to login otherwise.
  const isUnauthenticated =
    error instanceof ApiError && (error.status === 401 || error.status === 403);

  useEffect(() => {
    if (isUnauthenticated) router.replace("/login");
  }, [isUnauthenticated, router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-8">
        <Link href="/" aria-label="Kirokuのホームに戻る" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-[13px] font-bold text-white">
            K
          </div>
          <span className="text-[15px] font-bold text-zinc-900">Kiroku</span>
        </Link>
        <button
          type="button"
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
          className="text-[13px] font-medium text-zinc-700 hover:text-zinc-900"
        >
          ログアウト
        </button>
      </div>

      <div className="mx-auto max-w-[760px] px-8 py-16">
        <div className="mb-1.5 text-[24px] font-bold text-zinc-900">ワークスペースを選択</div>
        <div className="mb-8 text-[14px] text-zinc-500">続きから記録を始めましょう</div>

        {error && !isUnauthenticated && <ErrorAlert>{error.message}</ErrorAlert>}

        {isPending && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <WorkspaceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {workspaces && workspaces.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}`}
                className="flex items-center gap-3 rounded-[10px] border border-zinc-200 p-[18px] transition-shadow hover:border-indigo-200 hover:shadow-[0_4px_12px_rgba(79,93,234,0.08)]"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[15px] font-bold text-white ${iconColorOf(workspace)}`}
                >
                  {workspace.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-zinc-900">
                  {workspace.name}
                </div>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-dashed border-zinc-300 p-[18px] text-[14px] font-medium text-zinc-500 hover:border-indigo-500 hover:text-indigo-600"
            >
              <Plus size={16} />
              <span>新規ワークスペースを作成</span>
            </button>
          </div>
        )}

        {workspaces && workspaces.length === 0 && (
          <div className="flex flex-col items-center px-5 py-[70px] text-center">
            <div className="mb-1 text-[15px] font-semibold text-zinc-900">
              ワークスペースがまだありません
            </div>
            <div className="mb-5 text-[13px] text-zinc-500">
              ワークスペースを作成してチームと記録を共有しましょう
            </div>
            <Button onClick={() => setModalOpen(true)}>新規ワークスペースを作成</Button>
          </div>
        )}
      </div>

      <CreateWorkspaceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
