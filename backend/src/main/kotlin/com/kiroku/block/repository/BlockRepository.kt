package com.kiroku.block.repository

import com.kiroku.block.entity.Block
import org.springframework.data.jpa.repository.JpaRepository

interface BlockRepository : JpaRepository<Block, Long> {

    fun findByWorkspaceIdAndParentBlockIdIsNullAndIsTrashedFalseOrderByPosition(
        workspaceId: Long
    ): List<Block>

    fun findByParentBlockIdAndIsTrashedFalseOrderByPosition(
        parentBlockId: Long
    ): List<Block>
}
