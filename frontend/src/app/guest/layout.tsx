"use client";

import { Sidebar } from "@/features/workspace/components/Sidebar";
import { Topbar } from "@/features/workspace/components/Topbar";
import { StorageProvider } from "@/lib/storage/context";
import { guestStorage, guestWorkspaceId } from "@/lib/storage/guest-storage";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

const WORKSPACE_NAME = "Guest";

function pageHref(pageId: number): string {
  return `/guest/${pageId}`;
}

export default function GuestLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ pageId?: string }>();
  const pageId = params.pageId ? Number(params.pageId) : null;

  return (
    <StorageProvider storage={guestStorage} pageHref={pageHref} homeHref="/guest">
      <div className="flex h-screen flex-col overflow-hidden">
        <Topbar pageId={pageId} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar workspaceId={guestWorkspaceId} workspaceName={WORKSPACE_NAME} currentPageId={pageId} />
          <div className="flex-1 overflow-y-auto bg-white">{children}</div>
        </div>
      </div>
    </StorageProvider>
  );
}
