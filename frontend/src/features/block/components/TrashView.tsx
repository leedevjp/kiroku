"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteBlockMutation, useRestoreBlockMutation, useTrashedBlocksQuery } from "../hooks";
import { pageTitleOf } from "../title";
import type { BlockResponse } from "../types";

interface TrashViewProps {
  workspaceId: number;
}

function TrashRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3.5 last:border-b-0">
      <div className="h-3.5 w-1/3 animate-pulse rounded bg-zinc-100" />
    </div>
  );
}

export function TrashView({ workspaceId }: TrashViewProps) {
  const { data: trashedBlocks, isPending, error } = useTrashedBlocksQuery(workspaceId);
  const restoreBlock = useRestoreBlockMutation();
  const deleteBlock = useDeleteBlockMutation(workspaceId);
  const [confirmTarget, setConfirmTarget] = useState<BlockResponse | null>(null);

  const trashedPages = (trashedBlocks ?? []).filter((b) => b.type === "PAGE");

  function confirmDelete() {
    if (!confirmTarget || deleteBlock.isPending) return;
    deleteBlock.mutate(confirmTarget.id, { onSuccess: () => setConfirmTarget(null) });
  }

  return (
    <div className="mx-auto max-w-[640px] px-10 pb-24 pt-14">
      <div className="mb-1.5 text-[24px] font-bold text-zinc-900">ゴミ箱</div>
      <div className="mb-7 text-[14px] text-zinc-500">
        削除されたページはここに表示され、復元または完全に削除できます
      </div>

      {error && <ErrorAlert>{error.message}</ErrorAlert>}

      {isPending && (
        <div className="overflow-hidden rounded-[10px] border border-zinc-200">
          {Array.from({ length: 3 }, (_, i) => (
            <TrashRowSkeleton key={i} />
          ))}
        </div>
      )}

      {trashedBlocks && trashedPages.length > 0 && (
        <div className="overflow-hidden rounded-[10px] border border-zinc-200">
          {trashedPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3.5 last:border-b-0"
            >
              <div className="min-w-0 flex-1 truncate text-[14px] font-semibold text-zinc-900">
                {pageTitleOf(page.props)}
              </div>
              <div className="flex flex-shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => restoreBlock.mutate(page.id)}
                  disabled={restoreBlock.isPending}
                  className="rounded-md border border-zinc-200 px-3 py-1.5 text-[12px] font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-50"
                >
                  復元
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmTarget(page)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-600 hover:bg-red-50"
                >
                  完全に削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {trashedBlocks && trashedPages.length === 0 && (
        <div className="flex flex-col items-center px-5 py-[70px] text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] border-[1.5px] border-dashed border-zinc-300 text-zinc-300">
            <Trash2 size={20} />
          </div>
          <div className="mb-1 text-[15px] font-semibold text-zinc-900">ゴミ箱は空です</div>
          <div className="text-[13px] text-zinc-500">
            削除したページはここに表示され、いつでも復元できます
          </div>
        </div>
      )}

      <Modal open={confirmTarget != null} onClose={() => setConfirmTarget(null)}>
        <div className="mb-2 text-[16px] font-bold text-zinc-900">完全に削除しますか?</div>
        <div className="mb-5 text-[13px] leading-relaxed text-zinc-600">
          「{confirmTarget ? pageTitleOf(confirmTarget.props) : ""}
          」は完全に削除され、復元できなくなります。
        </div>
        {deleteBlock.isError && (
          <div className="mb-4">
            <ErrorAlert>{deleteBlock.error.message}</ErrorAlert>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmTarget(null)}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteBlock.isPending}>
            {deleteBlock.isPending ? "削除中…" : "完全に削除"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
