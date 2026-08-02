"use client";

import { useCreateBlockMutation, useRootBlocksQuery } from "@/features/block/hooks";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface WorkspaceIndexPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function WorkspaceIndexPage({ params }: WorkspaceIndexPageProps) {
  const { workspaceId: workspaceIdParam } = use(params);
  const workspaceId = Number(workspaceIdParam);
  const router = useRouter();

  const { data: rootBlocks, isLoading } = useRootBlocksQuery(workspaceId);
  const createBlock = useCreateBlockMutation();

  const pages = (rootBlocks ?? []).filter((b) => b.type === "PAGE");
  const firstPageId = pages[0]?.id;

  useEffect(() => {
    if (firstPageId != null) {
      router.replace(`/workspace/${workspaceId}/${firstPageId}`);
    }
  }, [firstPageId, workspaceId, router]);

  if (isLoading || firstPageId != null) return null;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="text-[15px] font-semibold text-zinc-900">まだページがありません</div>
      <button
        type="button"
        onClick={() =>
          createBlock.mutate(
            { workspaceId, parentBlockId: null, type: "PAGE", props: { title: "" } },
            { onSuccess: (created) => router.replace(`/workspace/${workspaceId}/${created.id}`) },
          )
        }
        className="rounded-md bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white"
      >
        最初のページを作成
      </button>
    </div>
  );
}
