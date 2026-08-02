"use client";

import { WorkspaceSettingsView } from "@/features/workspace/components/WorkspaceSettingsView";
import { use } from "react";

interface WorkspaceSettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const { workspaceId } = use(params);
  return <WorkspaceSettingsView workspaceId={Number(workspaceId)} />;
}
