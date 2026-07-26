import type {
  BlockResponse,
  CreateBlockRequest,
  MoveBlockRequest,
  UpdateBlockPropsRequest,
} from "@/features/block/types";

// Persistence boundary for block data. Signatures mirror the existing REST
// api functions so implementations (ApiStorage, GuestStorage) are drop-in
// interchangeable and the editor never knows which one it is talking to.
export interface Storage {
  getRootBlocks(workspaceId: number): Promise<BlockResponse[]>;
  getChildren(blockId: number): Promise<BlockResponse[]>;
  getBlock(id: number): Promise<BlockResponse>;
  createBlock(request: CreateBlockRequest): Promise<BlockResponse>;
  updateBlockProps(id: number, request: UpdateBlockPropsRequest): Promise<BlockResponse>;
  moveBlock(id: number, request: MoveBlockRequest): Promise<BlockResponse>;
  trashBlock(id: number): Promise<BlockResponse>;
}
