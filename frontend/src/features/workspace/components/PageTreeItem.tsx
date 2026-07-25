"use client";

import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useChildBlocksQuery } from "@/features/block/hooks";
import type { BlockResponse } from "@/features/block/types";
import { useSidebarStore } from "../store";

interface PageTreeItemProps {
  workspaceId: number;
  page: BlockResponse;
  currentPageId: number | null;
  depth: number;
}

export function PageTreeItem({ workspaceId, page, currentPageId, depth }: PageTreeItemProps) {
  const expanded = useSidebarStore((s) => s.expandedPageIds.has(page.id));
  const toggleExpanded = useSidebarStore((s) => s.toggleExpanded);

  const { data: children } = useChildBlocksQuery(page.id, { enabled: expanded });
  const childPages = (children ?? []).filter((b) => b.type === "PAGE");

  const active = page.id === currentPageId;
  const title = typeof page.props.title === "string" && page.props.title ? page.props.title : "無題のページ";

  return (
    <div>
      <div
        className={clsx(
          "flex items-center gap-0.5 rounded-md",
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
          href={`/workspace/${workspaceId}/${page.id}`}
          className="min-w-0 flex-1 truncate py-1.5 pr-2 text-[13px]"
        >
          {title}
        </Link>
      </div>
      {expanded &&
        childPages.map((child) => (
          <PageTreeItem
            key={child.id}
            workspaceId={workspaceId}
            page={child}
            currentPageId={currentPageId}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
