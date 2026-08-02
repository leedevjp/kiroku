"use client";

import { useLogoutMutation } from "@/features/auth/hooks";
import { useMeQuery } from "@/features/user/hooks";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SettingsSidebarProps {
  workspaceId: number;
  workspaceName: string;
}

interface NavItem {
  label: string;
  href: string;
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={clsx(
        "block rounded-md px-2 py-[7px] text-[13px]",
        active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      {item.label}
    </Link>
  );
}

export function SettingsSidebar({ workspaceId, workspaceName }: SettingsSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogoutMutation();
  const { data: me } = useMeQuery();

  const workspaceItems: NavItem[] = [
    { label: "ゴミ箱", href: `/workspace/${workspaceId}/trash` },
    { label: "ワークスペース設定", href: `/workspace/${workspaceId}/settings` },
  ];
  const accountItems: NavItem[] = [{ label: "アカウント設定", href: "/me" }];

  return (
    <div className="flex w-[260px] flex-shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-zinc-50">
      <div className="px-4 pb-2.5 pt-3.5">
        <Link
          href={`/workspace/${workspaceId}`}
          className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
        >
          ← エディタに戻る
        </Link>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3 pt-1.5">
        <div className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
          {workspaceName.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-900">
          {workspaceName}
        </div>
      </div>
      <div className="mx-4 mb-3 h-px bg-zinc-200" />

      <div className="mb-1.5 px-4 text-[11px] font-semibold tracking-wider text-zinc-400">
        ワークスペース
      </div>
      <div className="px-2">
        {workspaceItems.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
      </div>

      {accountItems.length > 0 && (
        <>
          <div className="mb-1.5 mt-4 px-4 text-[11px] font-semibold tracking-wider text-zinc-400">
            アカウント
          </div>
          <div className="px-2">
            {accountItems.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </div>
        </>
      )}

      <div className="flex-1" />

      <div className="border-t border-zinc-200 px-4 py-3.5">
        {me && (
          <div className="mb-0.5 truncate text-[12px] text-zinc-500">{me.nickname ?? me.email}</div>
        )}
        <button
          type="button"
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
          className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
