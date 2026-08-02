import { WorkspaceSelect } from "@/features/workspace/components/WorkspaceSelect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ワークスペースを選択 - Kiroku",
};

export default function WorkspacesPage() {
  return <WorkspaceSelect />;
}
