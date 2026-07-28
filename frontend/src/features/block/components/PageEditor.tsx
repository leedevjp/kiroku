"use client";

import { useRef } from "react";
import { useBlockQuery, useUpdateBlockPropsMutation } from "../hooks";
import { BlockList, type BlockListHandle } from "./BlockList";
import { EditableText, focusEditableAtEnd } from "./EditableText";

interface PageEditorProps {
  workspaceId: number;
  pageId: number;
}

export function PageEditor({ workspaceId, pageId }: PageEditorProps) {
  const { data: page } = useBlockQuery(pageId);
  const updateProps = useUpdateBlockPropsMutation();
  const blockListRef = useRef<BlockListHandle>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  if (!page) return null;

  const title = typeof page.props.title === "string" ? page.props.title : "";

  return (
    <div className="mx-auto max-w-[760px] px-10 pb-36 pt-16">
      <EditableText
        ref={titleRef}
        value={title}
        placeholder="無題のページ"
        onCommit={(text) =>
          updateProps.mutate({ id: page.id, request: { props: { ...page.props, title: text } } })
        }
        onEnter={() => blockListRef.current?.addBlockAtTop()}
        className="mb-6 text-[32px] font-bold leading-tight text-zinc-900"
      />
      <BlockList
        ref={blockListRef}
        workspaceId={workspaceId}
        pageId={pageId}
        onFocusTitle={() => focusEditableAtEnd(titleRef.current)}
      />
    </div>
  );
}
