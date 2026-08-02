"use client";

import { AccountSettingsView } from "@/features/user/components/AccountSettingsView";
import Link from "next/link";

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-16 items-center gap-4 border-b border-zinc-200 px-8">
        <Link
          href="/workspaces"
          className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← ワークスペースを選択に戻る
        </Link>
      </div>
      <AccountSettingsView />
    </div>
  );
}
