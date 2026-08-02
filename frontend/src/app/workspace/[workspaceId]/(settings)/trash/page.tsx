"use client";

import { TrashView } from "@/features/block/components/TrashView";
import { use } from "react";

interface TrashPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function TrashPage({ params }: TrashPageProps) {
  const { workspaceId } = use(params);
  return <TrashView workspaceId={Number(workspaceId)} />;
}
