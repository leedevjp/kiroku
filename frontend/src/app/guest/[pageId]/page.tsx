"use client";

import { PageEditor } from "@/features/block/components/PageEditor";
import { guestWorkspaceId } from "@/lib/storage/guest-storage";
import { use } from "react";

interface GuestPageRouteProps {
  params: Promise<{ pageId: string }>;
}

export default function GuestPageRoute({ params }: GuestPageRouteProps) {
  const { pageId } = use(params);
  return <PageEditor workspaceId={guestWorkspaceId} pageId={Number(pageId)} />;
}
