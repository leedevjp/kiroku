"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useLogoutMutation } from "@/features/auth/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useChangePasswordMutation,
  useDeleteUserMutation,
  useMeQuery,
  useUpdateUserMutation,
} from "../hooks";
import type { UserResponse } from "../types";

const passwordSchema = z
  .object({
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "パスワードが一致しません。",
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function initialOf(user: UserResponse): string {
  return (user.nickname?.trim() || user.email).slice(0, 1).toUpperCase();
}

// Shows "saved" feedback for a moment after a successful mutation.
function useSavedFlash(): [boolean, () => void] {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  function flash() {
    setVisible(true);
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(() => setVisible(false), 1800);
  }
  return [visible, flash];
}

export function AccountSettingsView() {
  const router = useRouter();
  const { data: me, error: meError } = useMeQuery();
  const updateUser = useUpdateUserMutation();
  const changePassword = useChangePasswordMutation();
  const deleteUser = useDeleteUserMutation();
  const logout = useLogoutMutation();

  // null = untouched by the user; the input then shows the fetched nickname.
  const [editedNickname, setEditedNickname] = useState<string | null>(null);
  const nickname = editedNickname ?? me?.nickname ?? "";
  const [profileSaved, flashProfileSaved] = useSavedFlash();
  const [passwordSaved, flashPasswordSaved] = useSavedFlash();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const {
    register,
    handleSubmit,
    reset: resetPasswordForm,
    formState: { errors },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  function saveProfile() {
    if (!me || updateUser.isPending) return;
    updateUser.mutate(
      { id: me.id, request: { nickname: nickname.trim() || null } },
      { onSuccess: flashProfileSaved },
    );
  }

  const onPasswordSubmit = handleSubmit((values) => {
    if (!me || changePassword.isPending) return;
    changePassword.mutate(
      { id: me.id, request: { password: values.password } },
      {
        onSuccess: () => {
          resetPasswordForm();
          flashPasswordSaved();
        },
      },
    );
  });

  const deleteDisabled = me == null || confirmText !== me.email;

  function confirmDelete() {
    if (deleteDisabled || deleteUser.isPending) return;
    deleteUser.mutate(me.id, {
      // The auth cookie outlives the deleted account - clear it before leaving.
      onSuccess: () =>
        logout.mutate(undefined, {
          onSettled: () => router.push("/login"),
        }),
    });
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setConfirmText("");
    deleteUser.reset();
  }

  return (
    <div className="mx-auto max-w-[600px] px-10 pb-24 pt-14">
      <div className="mb-8 text-[24px] font-bold text-zinc-900">アカウント設定</div>

      {meError && (
        <div className="mb-6">
          <ErrorAlert>アカウント情報を取得できませんでした。{meError.message}</ErrorAlert>
        </div>
      )}

      <div className="mb-3.5 text-[14px] font-semibold text-zinc-900">プロフィール</div>
      <div className="mb-8 flex gap-4 rounded-[10px] border border-zinc-200 p-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[20px] font-bold text-indigo-700">
          {me ? initialOf(me) : ""}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            saveProfile();
          }}
          className="flex flex-1 flex-col gap-3.5"
        >
          {updateUser.isError && <ErrorAlert>{updateUser.error.message}</ErrorAlert>}
          <TextField
            label="名前"
            type="text"
            maxLength={50}
            value={nickname}
            onChange={(event) => setEditedNickname(event.target.value)}
            disabled={me == null}
          />
          <div className="flex items-center gap-2.5">
            <Button type="submit" disabled={me == null || updateUser.isPending}>
              {updateUser.isPending ? "保存中…" : "保存"}
            </Button>
            {profileSaved && <span className="text-[12px] text-emerald-700">保存しました</span>}
          </div>
        </form>
      </div>

      <div className="mb-3.5 text-[14px] font-semibold text-zinc-900">パスワード変更</div>
      <div className="mb-8 rounded-[10px] border border-zinc-200 p-5">
        <form onSubmit={onPasswordSubmit} noValidate className="flex flex-col gap-3.5">
          {changePassword.isError && <ErrorAlert>{changePassword.error.message}</ErrorAlert>}
          <TextField
            label="新しいパスワード"
            type="password"
            placeholder="8文字以上"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <TextField
            label="新しいパスワード（確認）"
            type="password"
            placeholder="もう一度入力"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
          <div className="flex items-center gap-2.5">
            <Button type="submit" disabled={me == null || changePassword.isPending}>
              {changePassword.isPending ? "変更中…" : "変更"}
            </Button>
            {passwordSaved && (
              <span className="text-[12px] text-emerald-700">パスワードを変更しました</span>
            )}
          </div>
        </form>
      </div>

      <div className="mb-3.5 text-[14px] font-semibold text-red-600">Danger Zone</div>
      <div className="rounded-[10px] border border-red-200 bg-red-50/50 p-5">
        <div className="mb-1.5 text-[14px] font-semibold text-red-600">アカウントを削除</div>
        <div className="mb-3.5 text-[13px] leading-relaxed text-zinc-600">
          アカウントを削除すると、すべてのワークスペースへのアクセス権が失われます。この操作は取り消せません。
        </div>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          disabled={me == null}
          className="rounded-md border border-red-600 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          アカウントを削除
        </button>
      </div>

      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <div className="mb-2 text-[16px] font-bold text-red-600">アカウントを削除</div>
        <div className="mb-4 text-[13px] leading-relaxed text-zinc-600">
          確認のため、登録メールアドレス「
          <b className="text-zinc-900">{me?.email ?? ""}</b>
          」を入力してください。
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            confirmDelete();
          }}
          className="flex flex-col gap-5"
        >
          {deleteUser.isError && <ErrorAlert>{deleteUser.error.message}</ErrorAlert>}
          <TextField
            label="メールアドレス"
            type="text"
            placeholder={me?.email ?? ""}
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
              disabled={deleteDisabled || deleteUser.isPending}
            >
              {deleteUser.isPending ? "削除中…" : "削除する"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
