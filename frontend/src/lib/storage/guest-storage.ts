import type {
  BlockResponse,
  CreateBlockRequest,
  MoveBlockRequest,
  UpdateBlockPropsRequest,
} from "@/features/block/types";
import type { Storage } from "./types";

// Guest mode: blocks live in localStorage under a single key.
//
// Implementation detail: BlockResponse requires a numeric workspaceId, so
// guest blocks are scoped under the synthetic id below. It is NOT a real
// Workspace entity. Nothing outside this module may compare against or
// branch on this value - consumers receive it only as the opaque
// `guestWorkspaceId` export to satisfy existing component props.
const GUEST_WORKSPACE_ID = 0;
const STORAGE_KEY = "kiroku.guest.v1";

// Opaque scope id for wiring guest routes to components that take a
// workspaceId prop. Treat as a black box; never branch on it.
export const guestWorkspaceId = GUEST_WORKSPACE_ID;

interface StoredBlock extends BlockResponse {
  trashed: boolean;
}

interface GuestData {
  nextId: number;
  blocks: StoredBlock[];
}

function emptyData(): GuestData {
  return { nextId: 1, blocks: [] };
}

function load(): GuestData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as GuestData;
    if (typeof parsed.nextId !== "number" || !Array.isArray(parsed.blocks)) return emptyData();
    return parsed;
  } catch {
    return emptyData();
  }
}

function save(data: GuestData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toResponse(block: StoredBlock): BlockResponse {
  const { trashed: _trashed, ...response } = block;
  return { ...response, props: { ...response.props } };
}

function siblingsOf(data: GuestData, parentBlockId: number | null): StoredBlock[] {
  return data.blocks
    .filter((b) => !b.trashed && b.parentBlockId === parentBlockId)
    .sort((a, b) => a.position.localeCompare(b.position));
}

// Reassign lexicographic position keys for one sibling group. Local data is
// tiny, so rewriting the whole group on every structural change is the
// simplest way to keep `position` a valid string sort key.
function resequence(siblings: StoredBlock[]): void {
  siblings.forEach((block, index) => {
    block.position = String(index + 1).padStart(6, "0");
  });
}

// previousBlockId semantics (mirrors the backend):
//   number    -> insert right after that sibling
//   null      -> insert at the front
//   undefined -> append at the end
function placeBlock(
  data: GuestData,
  block: StoredBlock,
  previousBlockId: number | null | undefined,
): void {
  const siblings = siblingsOf(data, block.parentBlockId).filter((b) => b.id !== block.id);
  let index: number;
  if (previousBlockId == null) {
    index = previousBlockId === null ? 0 : siblings.length;
  } else {
    const at = siblings.findIndex((b) => b.id === previousBlockId);
    index = at === -1 ? siblings.length : at + 1;
  }
  siblings.splice(index, 0, block);
  resequence(siblings);
}

function findAlive(data: GuestData, id: number): StoredBlock {
  const block = data.blocks.find((b) => b.id === id && !b.trashed);
  if (!block) throw new Error("Block not found.");
  return block;
}

// Mirrors the backend's hasTrashedAncestor check: a block whose parent chain
// contains a trashed page is treated as gone even though its own row is
// still marked alive, so orphaned subpages of a deleted page don't linger
// as reachable.
function hasTrashedAncestor(data: GuestData, block: StoredBlock): boolean {
  let parentId = block.parentBlockId;
  while (parentId != null) {
    const parent = data.blocks.find((b) => b.id === parentId);
    if (!parent) return false;
    if (parent.trashed) return true;
    parentId = parent.parentBlockId;
  }
  return false;
}

export const guestStorage: Storage = {
  async getRootBlocks(_workspaceId: number): Promise<BlockResponse[]> {
    return siblingsOf(load(), null).map(toResponse);
  },

  async getChildren(blockId: number): Promise<BlockResponse[]> {
    const data = load();
    const parent = findAlive(data, blockId);
    if (hasTrashedAncestor(data, parent)) throw new Error("Block not found.");
    return siblingsOf(data, blockId).map(toResponse);
  },

  async getBlock(id: number): Promise<BlockResponse> {
    const data = load();
    const block = findAlive(data, id);
    if (hasTrashedAncestor(data, block)) throw new Error("Block not found.");
    return toResponse(block);
  },

  async createBlock(request: CreateBlockRequest): Promise<BlockResponse> {
    const data = load();
    const block: StoredBlock = {
      id: data.nextId,
      workspaceId: GUEST_WORKSPACE_ID,
      parentBlockId: request.parentBlockId,
      type: request.type,
      props: { ...(request.props ?? {}) },
      position: "",
      trashed: false,
    };
    data.nextId += 1;
    data.blocks.push(block);
    placeBlock(data, block, request.previousBlockId);
    save(data);
    return toResponse(block);
  },

  async updateBlockProps(id: number, request: UpdateBlockPropsRequest): Promise<BlockResponse> {
    const data = load();
    const block = findAlive(data, id);
    block.props = { ...request.props };
    save(data);
    return toResponse(block);
  },

  async moveBlock(id: number, request: MoveBlockRequest): Promise<BlockResponse> {
    const data = load();
    const block = findAlive(data, id);
    block.parentBlockId = request.parentBlockId;
    placeBlock(data, block, request.previousBlockId);
    save(data);
    return toResponse(block);
  },

  async trashBlock(id: number): Promise<BlockResponse> {
    const data = load();
    const block = findAlive(data, id);
    block.trashed = true;
    save(data);
    return toResponse(block);
  },
};
