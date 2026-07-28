"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { DragEvent } from "react";
import {
  useChildBlocksQuery,
  useCreateBlockMutation,
  useMoveBlockMutation,
  useTrashBlockMutation,
  useUpdateBlockPropsMutation,
} from "../hooks";
import type { BlockResponse, BlockType } from "../types";
import { BlockRow } from "./BlockRow";

interface BlockListProps {
  workspaceId: number;
  pageId: number;
}

export interface BlockListHandle {
  // Inserts an empty paragraph before every other block and focuses it.
  addBlockAtTop: () => void;
}

const CONTENT_TYPES: BlockType[] = ["PARAGRAPH", "HEADING", "TODO", "CODE", "IMAGE"];

export const BlockList = forwardRef<BlockListHandle, BlockListProps>(function BlockList(
  { workspaceId, pageId },
  ref,
) {
  const { data: children } = useChildBlocksQuery(pageId);
  const blocks = (children ?? []).filter((b) => CONTENT_TYPES.includes(b.type));

  const createBlock = useCreateBlockMutation();
  const updateProps = useUpdateBlockPropsMutation();
  const moveBlock = useMoveBlockMutation();
  const trashBlock = useTrashBlockMutation();

  const dragId = useRef<number | null>(null);
  const [focusBlockId, setFocusBlockId] = useState<number | null>(null);

  function commitContent(block: BlockResponse, content: string) {
    updateProps.mutate({ id: block.id, request: { props: { ...block.props, content } } });
  }

  function toggleTodo(block: BlockResponse) {
    updateProps.mutate({
      id: block.id,
      request: { props: { ...block.props, checked: !(block.props.checked === true) } },
    });
  }

  function createBlockAt(previousBlockId: number | null) {
    createBlock.mutate(
      { workspaceId, parentBlockId: pageId, type: "PARAGRAPH", props: { content: "" }, previousBlockId },
      { onSuccess: (created) => setFocusBlockId(created.id) },
    );
  }

  useImperativeHandle(ref, () => ({
    addBlockAtTop: () => createBlockAt(null),
  }));

  function handleDrop(targetBlock: BlockResponse) {
    const draggedId = dragId.current;
    dragId.current = null;
    if (draggedId == null || draggedId === targetBlock.id) return;

    const targetIndex = blocks.findIndex((b) => b.id === targetBlock.id);
    const previous = targetIndex > 0 ? blocks[targetIndex - 1] : null;
    if (previous?.id === draggedId) return;

    moveBlock.mutate({
      id: draggedId,
      request: { parentBlockId: pageId, previousBlockId: previous?.id ?? null },
    });
  }

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
        <div className="mb-1 text-[15px] font-semibold text-zinc-900">まだ内容がありません</div>
        <div className="mb-5 text-[13px] text-zinc-500">最初のブロックを追加して記録を始めましょう</div>
        <button
          type="button"
          onClick={() => createBlockAt(null)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white"
        >
          書き始める
        </button>
      </div>
    );
  }

  return (
    <div>
      {blocks.map((block) => (
        <BlockRow
          key={block.id}
          block={block}
          autoFocus={block.id === focusBlockId}
          onCommitContent={(text) => commitContent(block, text)}
          onToggleTodo={() => toggleTodo(block)}
          onAddAfter={() => createBlockAt(block.id)}
          onDelete={() => trashBlock.mutate(block.id)}
          onDragStart={() => {
            dragId.current = block.id;
          }}
          onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDrop={() => handleDrop(block)}
        />
      ))}
      <button
        type="button"
        onClick={() => createBlockAt(blocks[blocks.length - 1]?.id ?? null)}
        className="mt-2 flex items-center gap-1.5 py-2.5 text-[14px] text-zinc-300 hover:text-indigo-600"
      >
        <span>+</span>
        <span>ブロックを追加</span>
      </button>
    </div>
  );
});
