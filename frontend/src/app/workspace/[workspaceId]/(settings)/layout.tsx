"use client";

import { SettingsSidebar } from "@/features/workspace/components/SettingsSidebar";
import { useWorkspaceQuery } from "@/features/workspace/hooks";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

// Shell for the workspace settings screens (trash, workspace settings, ...).
// Deliberately does NOT mount StorageProvider: these screens are
// signed-in-workspace only and talk to the REST api directly - the Storage
// abstraction stays an editor concern.
export default function SettingsLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = Number(params.workspaceId);

  const { data: workspace } = useWorkspaceQuery(workspaceId);
  const workspaceName = workspace?.name ?? "Kiroku Workspace";

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SettingsSidebar workspaceId={workspaceId} workspaceName={workspaceName} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
