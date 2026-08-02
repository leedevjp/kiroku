"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useWorkspaceQuery,
} from "../hooks";

interface WorkspaceSettingsViewProps {
  workspaceId: number;
}

export function WorkspaceSettingsView({ workspaceId }: WorkspaceSettingsViewProps) {
  const router = useRouter();
  const { data: workspace } = useWorkspaceQuery(workspaceId);
  const updateWorkspace = useUpdateWorkspaceMutation();
  const deleteWorkspace = useDeleteWorkspaceMutation();

  // null = untouched by the user; the input then shows the fetched name.
  const [editedName, setEditedName] = useState<string | null>(null);
  const name = editedName ?? workspace?.name ?? "";
  const [savedFlash, setSavedFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => () => clearTimeout(flashTimer.current ?? undefined), []);

  function saveName() {
    const trimmed = name.trim();
    if (!trimmed || updateWorkspace.isPending) return;
    updateWorkspace.mutate(
      { id: workspaceId, request: { name: trimmed } },
      {
        onSuccess: () => {
          setSavedFlash(true);
          clearTimeout(flashTimer.current ?? undefined);
          flashTimer.current = setTimeout(() => setSavedFlash(false), 1800);
        },
      },
    );
  }

  const deleteDisabled = workspace == null || confirmText !== workspace.name;

  function confirmDelete() {
    if (deleteDisabled || deleteWorkspace.isPending) return;
    deleteWorkspace.mutate(workspaceId, { onSuccess: () => router.push("/workspaces") });
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setConfirmText("");
    deleteWorkspace.reset();
  }

  return (
    <div className="mx-auto max-w-[600px] px-10 pb-24 pt-14">
      <div className="mb-8 text-[24px] font-bold text-zinc-900">ワークスペース設定</div>

      <div className="mb-3.5 text-[14px] font-semibold text-zinc-900">基本情報</div>
      <div className="mb-8 rounded-[10px] border border-zinc-200 p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            saveName();
          }}
          className="flex flex-col gap-3.5"
        >
          {updateWorkspace.isError && <ErrorAlert>{updateWorkspace.error.message}</ErrorAlert>}
          <TextField
            label="ワークスペース名"
            type="text"
            value={name}
            onChange={(event) => setEditedName(event.target.value)}
          />
          <div className="flex items-center gap-2.5">
            <Button type="submit" disabled={!name.trim() || updateWorkspace.isPending}>
              {updateWorkspace.isPending ? "保存中…" : "保存"}
            </Button>
            {savedFlash && <span className="text-[12px] text-emerald-700">保存しました</span>}
          </div>
        </form>
      </div>

      <div className="mb-3.5 text-[14px] font-semibold text-red-600">Danger Zone</div>
      <div className="rounded-[10px] border border-red-200 bg-red-50/50 p-5">
        <div className="mb-1.5 text-[14px] font-semibold text-red-600">ワークスペースを削除</div>
        <div className="mb-3.5 text-[13px] leading-relaxed text-zinc-600">
          この操作は取り消せません。すべてのページ、ブロック、メンバー情報が完全に削除されます。
        </div>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-md border border-red-600 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
        >
          ワークスペースを削除
        </button>
      </div>

      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <div className="mb-2 text-[16px] font-bold text-red-600">ワークスペースを削除</div>
        <div className="mb-4 text-[13px] leading-relaxed text-zinc-600">
          確認のため、ワークスペース名「
          <b className="text-zinc-900">{workspace?.name ?? ""}</b>
          」を入力してください。
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            confirmDelete();
          }}
          className="flex flex-col gap-5"
        >
          {deleteWorkspace.isError && <ErrorAlert>{deleteWorkspace.error.message}</ErrorAlert>}
          <TextField
            label="ワークスペース名"
            type="text"
            placeholder={workspace?.name ?? ""}
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeDeleteModal}>
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={deleteDisabled || deleteWorkspace.isPending}
            >
              {deleteWorkspace.isPending ? "削除中…" : "削除する"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
