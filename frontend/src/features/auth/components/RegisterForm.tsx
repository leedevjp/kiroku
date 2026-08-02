"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useCreateUserMutation } from "@/features/user/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "./AuthCard";

const registerSchema = z
  .object({
    nickname: z.string(),
    email: z.email("メールアドレスの形式が正しくありません"),
    password: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "パスワードが一致しません。",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const createUser = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nickname: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = handleSubmit((values) => {
    createUser.mutate({
      email: values.email,
      password: values.password,
      nickname: values.nickname.trim() || null,
    });
  });

  if (createUser.isSuccess) {
    return (
      <AuthCard>
        <div className="py-3 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Check size={20} />
          </div>
          <div className="mb-2 text-[16px] font-bold text-zinc-900">アカウントを作成しました</div>
          <div className="mb-5 text-[13px] leading-relaxed text-zinc-500">
            {getValues("email")} でログインしてKirokuを使い始めましょう。
          </div>
          <Link
            href="/login"
            className="block rounded-md border border-zinc-200 py-2.5 text-center text-[14px] font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            ログイン画面へ
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <>
      <AuthCard>
        <div className="mb-1 text-[20px] font-bold text-zinc-900">会員登録</div>
        <div className="mb-6 text-[13px] text-zinc-500">数秒でKirokuを使い始められます</div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3.5">
          {createUser.isError && <ErrorAlert>{createUser.error.message}</ErrorAlert>}

          <TextField
            label="名前"
            type="text"
            placeholder="山田 太郎"
            autoComplete="name"
            error={errors.nickname?.message}
            {...register("nickname")}
          />
          <TextField
            label="メールアドレス"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="パスワード"
            type="password"
            placeholder="8文字以上"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <TextField
            label="パスワード（確認）"
            type="password"
            placeholder="もう一度入力"
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register("confirm")}
          />

          <Button
            type="submit"
            fullWidth
            disabled={createUser.isPending}
            className="mt-2 py-2.5 text-[14px]"
          >
            {createUser.isPending ? "登録中…" : "会員登録"}
          </Button>
        </form>
      </AuthCard>

      <div className="mt-6 text-[13px] text-zinc-500">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          ログイン
        </Link>
      </div>
    </>
  );
}
