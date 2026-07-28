"use client";

import { Sidebar } from "@/features/workspace/components/Sidebar";
import { Topbar } from "@/features/workspace/components/Topbar";
import { useWorkspaceQuery } from "@/features/workspace/hooks";
import { apiStorage } from "@/lib/storage/api-storage";
import { StorageProvider } from "@/lib/storage/context";
import { useParams } from "next/navigation";
import { useCallback, type ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ workspaceId: string; pageId?: string }>();
  const workspaceId = Number(params.workspaceId);
  const pageId = params.pageId ? Number(params.pageId) : null;

  const { data: workspace } = useWorkspaceQuery(workspaceId);
  const workspaceName = workspace?.name ?? "Kiroku Workspace";

  const pageHref = useCallback((id: number) => `/workspace/${workspaceId}/${id}`, [workspaceId]);

  return (
    <StorageProvider storage={apiStorage} pageHref={pageHref} homeHref={`/workspace/${workspaceId}`}>
      <div className="flex h-screen flex-col overflow-hidden">
        <Topbar workspaceName={workspaceName} pageId={pageId} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar workspaceId={workspaceId} workspaceName={workspaceName} currentPageId={pageId} />
          <div className="flex-1 overflow-y-auto bg-white">{children}</div>
        </div>
      </div>
    </StorageProvider>
  );
}
