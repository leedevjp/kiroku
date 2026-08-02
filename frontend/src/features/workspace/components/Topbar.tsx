"use client";

import { useBlockQuery } from "@/features/block/hooks";
import { pageTitleOf } from "@/features/block/title";
import { useIsMutating } from "@tanstack/react-query";
import clsx from "clsx";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useSidebarStore } from "../store";

interface TopbarProps {
  pageId: number | null;
}

export function Topbar({ pageId }: TopbarProps) {
  const { data: page } = useBlockQuery(pageId ?? 0, { enabled: pageId != null });
  const parentId = page?.parentBlockId ?? null;
  const { data: parentPage } = useBlockQuery(parentId ?? 0, { enabled: parentId != null });

  const isSaving = useIsMutating({ mutationKey: ["blocks", "write"] }) > 0;
  const toggleMobileOpen = useSidebarStore((s) => s.toggleMobileOpen);

  return (
    <div className="flex h-[52px] flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-[13px] text-zinc-500">
        <button
          type="button"
          onClick={toggleMobileOpen}
          aria-label="サイドバーを開く"
          className="-ml-1.5 mr-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 md:hidden"
        >
          <Menu size={16} />
        </button>
        <Link
          href="/"
          aria-label="Kirokuのホームに戻る"
          className="-ml-1 mr-0.5 flex flex-shrink-0 items-center gap-1.5 rounded px-1 py-1 hover:bg-zinc-100"
        >
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            K
          </div>
          <span className="whitespace-nowrap text-[13px] font-bold text-zinc-900">Kiroku</span>
        </Link>
        {page && (
          <>
            <span>/</span>
            {parentPage && (
              <>
                <span className="whitespace-nowrap">{pageTitleOf(parentPage.props)}</span>
                <span>/</span>
              </>
            )}
            <span className="truncate font-medium text-zinc-900">{pageTitleOf(page.props)}</span>
          </>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-4">
        {page && (
          <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
            <div className={clsx("h-1.5 w-1.5 rounded-full", isSaving ? "bg-amber-500" : "bg-emerald-500")} />
            <span>{isSaving ? "保存中…" : "保存済み"}</span>
          </div>
        )}
        {/* Hidden until login is actually implemented
        <div className="h-3.5 w-px bg-zinc-200" />
        <a href="#" className="text-[13px] font-medium text-zinc-900">
          ログイン
        </a>
        */}
      </div>
    </div>
  );
}
