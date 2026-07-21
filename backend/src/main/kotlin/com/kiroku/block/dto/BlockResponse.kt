package com.kiroku.block.dto

import com.kiroku.block.entity.Block
import com.kiroku.block.entity.BlockType

data class BlockResponse(
    val id: Long,
    val workspaceId: Long,
    val parentBlockId: Long?,
    val type: BlockType,
    val props: Map<String, Any?>,
    val position: String
) {
    companion object {
        fun from(block: Block): BlockResponse {
            return BlockResponse(
                id = block.id,
                workspaceId = block.workspaceId,
                parentBlockId = block.parentBlockId,
                type = block.type,
                props = block.props,
                position = block.position
            )
        }
    }
}
