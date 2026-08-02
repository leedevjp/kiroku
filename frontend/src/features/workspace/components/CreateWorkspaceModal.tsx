"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useState } from "react";
import { useCreateWorkspaceMutation } from "../hooks";

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({ open, onClose }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const createWorkspace = useCreateWorkspaceMutation();

  function close() {
    setName("");
    createWorkspace.reset();
    onClose();
  }

  function submit() {
    const trimmed = name.trim();
    if (!trimmed || createWorkspace.isPending) return;
    createWorkspace.mutate({ name: trimmed }, { onSuccess: close });
  }

  return (
    <Modal open={open} onClose={close}>
      <div className="mb-4 text-[16px] font-bold text-zinc-900">新規ワークスペース</div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex flex-col gap-4"
      >
        {createWorkspace.isError && <ErrorAlert>{createWorkspace.error.message}</ErrorAlert>}
        <TextField
          label="ワークスペース名"
          type="text"
          placeholder="例: Marketing Team"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" disabled={!name.trim() || createWorkspace.isPending}>
            {createWorkspace.isPending ? "作成中…" : "作成"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
