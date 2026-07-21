package com.kiroku.block.dto

import com.kiroku.block.entity.BlockType

data class CreateBlockRequest(
    val workspaceId: Long,
    val parentBlockId: Long?,
    val type: BlockType,
    val props: Map<String, Any?> = emptyMap(),
    /** The block this one will be placed immediately after (null = insert at the front). */
    val previousBlockId: Long? = null
)
