export type BlockType = "PAGE" | "PARAGRAPH" | "HEADING" | "TODO" | "IMAGE" | "CODE";

export interface BlockResponse {
  id: number;
  workspaceId: number;
  parentBlockId: number | null;
  type: BlockType;
  props: Record<string, unknown>;
  // Lexicographic order key among siblings - sort as a string, never parse as a number.
  position: string;
}

export interface CreateBlockRequest {
  workspaceId: number;
  parentBlockId: number | null;
  type: BlockType;
  props?: Record<string, unknown>;
  previousBlockId?: number | null;
}

export interface UpdateBlockPropsRequest {
  props: Record<string, unknown>;
}

export interface MoveBlockRequest {
  parentBlockId: number | null;
  previousBlockId: number | null;
}
