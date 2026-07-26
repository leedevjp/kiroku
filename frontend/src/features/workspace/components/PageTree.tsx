"use client";

import { useRootBlocksQuery } from "@/features/block/hooks";
import { PageTreeItem } from "./PageTreeItem";

interface PageTreeProps {
  workspaceId: number;
  currentPageId: number | null;
}

export function PageTree({ workspaceId, currentPageId }: PageTreeProps) {
  const { data: rootBlocks } = useRootBlocksQuery(workspaceId);
  const pages = (rootBlocks ?? []).filter((b) => b.type === "PAGE");

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-3 pt-1">
      {pages.map((page) => (
        <PageTreeItem key={page.id} page={page} currentPageId={currentPageId} depth={0} />
      ))}
    </div>
  );
}
