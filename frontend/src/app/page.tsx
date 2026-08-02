"use client";

import { useLogoutMutation } from "@/features/auth/hooks";
import { useMeQuery } from "@/features/user/hooks";
import Link from "next/link";

const FEATURES = [
  {
    icon: "▤",
    title: "ブロック単位で自由に記録",
    description:
      "見出し・リスト・タスク・コードをブロックとして組み合わせ、ドラッグで自由に並べ替え。",
  },
  {
    icon: "⇄",
    title: "どこからでも続きを",
    description: "ログインすればワークスペース単位で自動同期。デバイスをまたいでチームと共有。",
  },
  {
    icon: "☰",
    title: "階層で整理",
    description: "ページを入れ子にしてサブページを作成。議事録やPRDを体系立てて記録できます。",
  },
];

function EditorPreview() {
  return (
    <div className="mt-14 w-full overflow-hidden rounded-[14px] border border-zinc-200 bg-white text-left shadow-[0_20px_48px_rgba(31,35,40,0.08)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3.5">
        <div className="h-[9px] w-[9px] rounded-full bg-zinc-200" />
        <div className="h-[9px] w-[9px] rounded-full bg-zinc-200" />
        <div className="h-[9px] w-[9px] rounded-full bg-zinc-200" />
      </div>
      <div className="flex h-[280px]">
        <div className="hidden w-[180px] flex-shrink-0 border-r border-zinc-200 bg-zinc-50 px-3 py-4 sm:block">
          <div className="mb-2.5 text-[11px] font-semibold text-zinc-500">Kiroku Workspace</div>
          <div className="mb-0.5 rounded-md bg-indigo-50 px-2 py-1.5 text-[12px] font-semibold text-indigo-700">
            週次定例MTG議事録
          </div>
          <div className="rounded-md px-2 py-1.5 text-[12px] text-zinc-700">Kiroku PRD v2</div>
          <div className="rounded-md px-2 py-1.5 text-[12px] text-zinc-700">エディタ設計メモ</div>
        </div>
        <div className="flex-1 px-7 py-6">
          <div className="mb-3.5 text-[19px] font-bold text-zinc-900">
            週次定例MTG — 2026年7月16日
          </div>
          <div className="mb-2.5 text-[13px] text-zinc-700">参加者: 佐藤, 田中, Chen, Kim</div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded bg-indigo-600" />
            <span className="text-[13px] text-zinc-500 line-through">
              リリース日を8月4日に確定する
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded border-[1.5px] border-zinc-300" />
            <span className="text-[13px] text-zinc-900">
              オンボーディングのA/Bテストを来週開始する
            </span>
          </div>
          <div className="my-3.5 h-px bg-zinc-200" />
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-[12px] text-zinc-700">
            {"function saveDocument(pageId, blocks) {...}"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: me } = useMeQuery();
  const logout = useLogoutMutation();
  const isLoggedIn = me != null;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-[13px] font-bold text-white">
            K
          </div>
          <span className="text-[15px] font-bold text-zinc-900">Kiroku</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => logout.mutate()}
              className="whitespace-nowrap text-[14px] font-medium text-zinc-700 hover:text-zinc-900"
            >
              ログアウト
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap text-[14px] font-medium text-zinc-700 hover:text-zinc-900"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-md border border-zinc-200 px-3.5 py-[7px] text-[14px] font-semibold text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
              >
                会員登録
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[720px] flex-col items-center px-8 pb-[70px] pt-[110px] text-center">
        <div className="mb-5 inline-flex rounded-[20px] bg-indigo-50 px-3 py-1.5 text-[12px] font-semibold text-indigo-700">
          記録 & コラボレーション
        </div>
        <h1 className="mb-3.5 text-[46px] font-bold leading-[1.25] text-zinc-900 [text-wrap:balance]">
          考えを、そのまま記録に。
        </h1>
        <div className="mb-4 text-[15px] font-medium text-zinc-500">
          Kiroku — a workspace for your thinking
        </div>
        <p className="mb-9 max-w-[520px] text-[16px] leading-[1.7] text-zinc-600 [text-wrap:pretty]">
          ログイン不要で、開いた瞬間から書き始められるドキュメントツール。ブロック単位で自由に記録し、必要になったらチームと共有できます。
        </p>
        <div className="mb-4 flex gap-3">
          <Link
            href="/guest"
            className="whitespace-nowrap rounded-lg bg-indigo-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-indigo-700"
          >
            ゲストとして始める
          </Link>
          {isLoggedIn ? (
            <Link
              href="/workspaces"
              className="whitespace-nowrap rounded-lg border border-zinc-200 px-6 py-3 text-[15px] font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              はじめる
            </Link>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-lg border border-zinc-200 px-6 py-3 text-[15px] font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              ログイン
            </Link>
          )}
        </div>
        <div className="text-[13px] text-zinc-500">
          クレジットカード不要 ・ ログインなしで今すぐ利用可能
        </div>

        <EditorPreview />
      </div>

      <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-7 px-8 pb-[100px] pt-10 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title}>
            <div className="mb-2.5 text-[20px] text-indigo-600">{feature.icon}</div>
            <div className="mb-1.5 text-[15px] font-semibold text-zinc-900">{feature.title}</div>
            <div className="text-[13px] leading-[1.7] text-zinc-500">{feature.description}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 px-8 py-6 text-[12px] text-zinc-500">
        <span>© 2026 Kiroku</span>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-zinc-700">
            ログイン
          </Link>
          <Link href="/register" className="hover:text-zinc-700">
            会員登録
          </Link>
        </div>
      </div>
    </div>
  );
}
