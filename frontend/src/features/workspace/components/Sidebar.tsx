"use client";

import { useCreateBlockMutation } from "@/features/block/hooks";
import { usePageHref } from "@/lib/storage/context";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSidebarStore } from "../store";
import { PageTree } from "./PageTree";

interface SidebarProps {
  workspaceId: number;
  workspaceName: string;
  currentPageId: number | null;
}

export function Sidebar({ workspaceId, workspaceName, currentPageId }: SidebarProps) {
  const router = useRouter();
  const pageHref = usePageHref();
  const createBlock = useCreateBlockMutation();
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const closeMobile = useSidebarStore((s) => s.closeMobile);

  // Once the visible page changes, the drawer has done its job on mobile.
  useEffect(() => {
    closeMobile();
  }, [currentPageId, closeMobile]);

  function handleNewPage() {
    createBlock.mutate(
      { workspaceId, parentBlockId: null, type: "PAGE", props: { title: "" } },
      { onSuccess: (created) => router.push(pageHref(created.id)) },
    );
  }

  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50 transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-4 pb-2.5 pt-3.5 hover:bg-zinc-100">
          <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            {workspaceName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-900">
            {workspaceName}
          </div>
        </div>

        {/* Hidden until search is actually implemented
      <div className="px-4 pb-2.5">
        <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-400">
          <Search size={14} />
          <input
            type="text"
            placeholder="ページを検索..."
            disabled
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-zinc-400"
          />
        </div>
      </div>
      */}

        <button
          type="button"
          onClick={handleNewPage}
          className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-indigo-600 hover:bg-zinc-100"
        >
          <Plus size={14} />
          <span>新規ページ</span>
        </button>

        <div className="mx-4 mb-1 mt-2 h-px bg-zinc-200" />

        <PageTree workspaceId={workspaceId} currentPageId={currentPageId} />

        {/* Hidden until login is actually implemented
      <div className="border-t border-zinc-200 px-4 py-3">
        <div className="mb-1.5 text-[12px] leading-relaxed text-zinc-500">
          ログインするとページを同期・共有できます
        </div>
        <a href="#" className="text-[12px] font-semibold text-zinc-900">
          ログイン →
        </a>
      </div>
      */}
      </div>
    </>
  );
}
