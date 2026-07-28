"use client";

import { useBlockQuery } from "@/features/block/hooks";
import { useIsMutating } from "@tanstack/react-query";
import clsx from "clsx";

interface TopbarProps {
  workspaceName: string;
  pageId: number | null;
}

function titleOf(props: Record<string, unknown> | undefined): string {
  return props && typeof props.title === "string" && props.title ? props.title : "無題のページ";
}

export function Topbar({ workspaceName, pageId }: TopbarProps) {
  const { data: page } = useBlockQuery(pageId ?? 0, { enabled: pageId != null });
  const parentId = page?.parentBlockId ?? null;
  const { data: parentPage } = useBlockQuery(parentId ?? 0, { enabled: parentId != null });

  const isSaving = useIsMutating({ mutationKey: ["blocks", "write"] }) > 0;

  return (
    <div className="flex h-[52px] flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden text-[13px] text-zinc-500">
        <span className="whitespace-nowrap">{workspaceName}</span>
        {page && (
          <>
            <span>/</span>
            {parentPage && (
              <>
                <span className="whitespace-nowrap">{titleOf(parentPage.props)}</span>
                <span>/</span>
              </>
            )}
            <span className="truncate font-medium text-zinc-900">{titleOf(page.props)}</span>
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
