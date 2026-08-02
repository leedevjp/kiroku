"use client";

import { ErrorAlert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useLoginMutation } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "./AuthCard";

const loginSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function loginErrorMessage(error: Error): string {
  if (error instanceof ApiError && error.status === 401) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }
  return error.message;
}

export function LoginForm() {
  const router = useRouter();
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, { onSuccess: () => router.push("/workspaces") });
  });

  return (
    <>
      <AuthCard>
        <div className="mb-1 text-[20px] font-bold text-zinc-900">ログイン</div>
        <div className="mb-6 text-[13px] text-zinc-500">Kirokuに記録を同期・共有しましょう</div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          {login.isError && <ErrorAlert>{loginErrorMessage(login.error)}</ErrorAlert>}

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
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            fullWidth
            disabled={login.isPending}
            className="mt-1 py-2.5 text-[14px]"
          >
            {login.isPending ? "ログイン中…" : "ログイン"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-2.5">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-[12px] text-zinc-400">または</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <Link
          href="/guest"
          className="block rounded-md border border-zinc-200 py-2.5 text-center text-[14px] font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          ゲストとして続ける
        </Link>
      </AuthCard>

      <div className="mt-6 text-[13px] text-zinc-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
          会員登録
        </Link>
      </div>
    </>
  );
}
