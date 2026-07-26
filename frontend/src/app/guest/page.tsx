"use client";

import { useCreateBlockMutation, useRootBlocksQuery } from "@/features/block/hooks";
import { usePageHref } from "@/lib/storage/context";
import { guestWorkspaceId } from "@/lib/storage/guest-storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestIndexPage() {
  const router = useRouter();
  const pageHref = usePageHref();

  const { data: rootBlocks, isLoading } = useRootBlocksQuery(guestWorkspaceId);
  const createBlock = useCreateBlockMutation();

  const pages = (rootBlocks ?? []).filter((b) => b.type === "PAGE");
  const firstPageId = pages[0]?.id;

  useEffect(() => {
    if (firstPageId != null) {
      router.replace(pageHref(firstPageId));
    }
  }, [firstPageId, pageHref, router]);

  if (isLoading || firstPageId != null) return null;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="text-[15px] font-semibold text-zinc-900">まだページがありません</div>
      <button
        type="button"
        onClick={() =>
          createBlock.mutate(
            { workspaceId: guestWorkspaceId, parentBlockId: null, type: "PAGE", props: { title: "" } },
            { onSuccess: (created) => router.replace(pageHref(created.id)) },
          )
        }
        className="rounded-md bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white"
      >
        最初のページを作成
      </button>
    </div>
  );
}
