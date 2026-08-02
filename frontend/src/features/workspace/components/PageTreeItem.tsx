"use client";

import clsx from "clsx";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChildBlocksQuery, useTrashBlockMutation } from "@/features/block/hooks";
import { pageTitleOf } from "@/features/block/title";
import type { BlockResponse } from "@/features/block/types";
import { useHomeHref, usePageHref } from "@/lib/storage/context";
import { useSidebarStore } from "../store";

interface PageTreeItemProps {
  page: BlockResponse;
  currentPageId: number | null;
  depth: number;
}

export function PageTreeItem({ page, currentPageId, depth }: PageTreeItemProps) {
  const router = useRouter();
  const pageHref = usePageHref();
  const homeHref = useHomeHref();
  const expanded = useSidebarStore((s) => s.expandedPageIds.has(page.id));
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);
  const trashBlock = useTrashBlockMutation();

  const { data: children } = useChildBlocksQuery(page.id, { enabled: expanded });
  const childPages = (children ?? []).filter((b) => b.type === "PAGE");

  const active = page.id === currentPageId;
  const title = pageTitleOf(page.props);

  function handleDelete() {
    trashBlock.mutate(page.id, {
      onSuccess: () => {
        if (active) router.push(homeHref);
      },
    });
  }

  return (
    <div>
      <div
        className={clsx(
          "group flex items-center gap-0.5 rounded-md",
          active ? "bg-indigo-50 font-semibold text-indigo-700" : "font-normal text-zinc-700 hover:bg-zinc-100",
        )}
        style={{ paddingLeft: depth * 14 }}
      >
        <button
          type="button"
          onClick={() => toggleExpanded(page.id)}
          aria-label={expanded ? "折りたたむ" : "展開する"}
          className="flex w-5 flex-shrink-0 items-center justify-center py-1.5 text-zinc-300"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <Link
          href={pageHref(page.id)}
          className="min-w-0 flex-1 truncate py-1.5 pr-2 text-[13px]"
        >
          {title}
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="ページを削除"
          className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded text-zinc-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 mr-1.5"
        >
          <X size={12} />
        </button>
      </div>
      {expanded &&
        childPages.map((child) => (
          <PageTreeItem
            key={child.id}
            page={child}
            currentPageId={currentPageId}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
