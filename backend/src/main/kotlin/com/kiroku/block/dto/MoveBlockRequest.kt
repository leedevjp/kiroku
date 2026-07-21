package com.kiroku.block.dto

data class MoveBlockRequest(
    val parentBlockId: Long?,
    // The block this one will be placed immediately after (null = move to the front).
    val previousBlockId: Long?
)
