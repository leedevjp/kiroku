"use client";

import { PageEditor } from "@/features/block/components/PageEditor";
import { use } from "react";

interface WorkspacePageRouteProps {
  params: Promise<{ workspaceId: string; pageId: string }>;
}

export default function WorkspacePageRoute({ params }: WorkspacePageRouteProps) {
  const { workspaceId, pageId } = use(params);
  return <PageEditor workspaceId={Number(workspaceId)} pageId={Number(pageId)} />;
}
