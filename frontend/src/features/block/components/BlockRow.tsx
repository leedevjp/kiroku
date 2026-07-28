"use client";

import clsx from "clsx";
import { GripVertical, Plus, X } from "lucide-react";
import type { DragEvent } from "react";
import type { BlockResponse } from "../types";
import { EditableText } from "./EditableText";

interface BlockRowProps {
  block: BlockResponse;
  autoFocus?: boolean;
  onCommitContent: (text: string) => void;
  onToggleTodo: () => void;
  onAddAfter: () => void;
  onDelete: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

function textContent(props: Record<string, unknown>): string {
  return typeof props.content === "string" ? props.content : "";
}

type BlockContentProps = Pick<BlockRowProps, "block" | "autoFocus" | "onCommitContent" | "onToggleTodo" | "onAddAfter">;

function BlockContent({ block, autoFocus, onCommitContent, onToggleTodo, onAddAfter }: BlockContentProps) {
  const content = textContent(block.props);

  switch (block.type) {
    case "HEADING": {
      const level = block.props.level === 2 ? 2 : 1;
      return (
        <EditableText
          value={content}
          autoFocus={autoFocus}
          onCommit={onCommitContent}
          onEnter={onAddAfter}
          className={
            level === 1
              ? "py-1 text-xl font-bold text-zinc-900"
              : "py-1 pt-2 text-base font-semibold text-zinc-900"
          }
        />
      );
    }
    case "TODO": {
      const checked = block.props.checked === true;
      return (
        <div className="flex items-start gap-2 py-0.5">
          <button
            type="button"
            onClick={onToggleTodo}
            aria-pressed={checked}
            className={clsx(
              "mt-[3px] h-4 w-4 flex-shrink-0 rounded border",
              checked ? "border-indigo-600 bg-indigo-600" : "border-zinc-300 bg-white",
            )}
          />
          <EditableText
            value={content}
            autoFocus={autoFocus}
            onCommit={onCommitContent}
            onEnter={onAddAfter}
            className={clsx(
              "flex-1 text-[15px] leading-relaxed",
              checked ? "text-zinc-400 line-through" : "text-zinc-900",
            )}
          />
        </div>
      );
    }
    case "CODE": {
      const lang = typeof block.props.lang === "string" ? block.props.lang : "";
      return (
        <div className="my-2 rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-3">
          <div className="mb-1.5 font-mono text-[11px] text-zinc-500">{lang}</div>
          <EditableText
            value={content}
            autoFocus={autoFocus}
            onCommit={onCommitContent}
            className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-zinc-900"
          />
        </div>
      );
    }
    case "PARAGRAPH":
    default:
      return (
        <EditableText
          value={content}
          autoFocus={autoFocus}
          onCommit={onCommitContent}
          onEnter={onAddAfter}
          className="py-0.5 text-[15px] leading-relaxed text-zinc-900"
        />
      );
  }
}

export function BlockRow({
  block,
  autoFocus,
  onCommitContent,
  onToggleTodo,
  onAddAfter,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: BlockRowProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="group flex items-start gap-0.5 rounded hover:bg-zinc-50"
    >
      <div className="flex h-[28px] w-4 flex-shrink-0 cursor-grab items-center justify-center text-zinc-300">
        <GripVertical size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <BlockContent
          block={block}
          autoFocus={autoFocus}
          onCommitContent={onCommitContent}
          onToggleTodo={onToggleTodo}
          onAddAfter={onAddAfter}
        />
      </div>
      <div className="flex flex-shrink-0 flex-col gap-0.5 pt-0.5 opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={onAddAfter}
          aria-label="ブロックを追加"
          className="flex h-[18px] w-[18px] items-center justify-center rounded text-zinc-300 hover:bg-zinc-200 hover:text-indigo-600"
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="ブロックを削除"
          className="flex h-[18px] w-[18px] items-center justify-center rounded text-zinc-300 hover:bg-red-50 hover:text-red-600"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
