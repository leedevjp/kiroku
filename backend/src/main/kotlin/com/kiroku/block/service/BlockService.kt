package com.kiroku.block.service

import com.kiroku.block.entity.Block
import com.kiroku.block.entity.BlockType
import com.kiroku.block.repository.BlockRepository
import com.kiroku.block.util.PositionKeyGenerator
import com.kiroku.workspace.service.WorkspaceAuthorizationService
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class BlockService(
    private val blockRepository: BlockRepository,
    private val workspaceAuthorizationService: WorkspaceAuthorizationService
) {

    @Transactional
    fun createBlock(
        workspaceId: Long,
        parentBlockId: Long?,
        type: BlockType,
        props: Map<String, Any?>,
        previousBlockId: Long?,
        userId: Long
    ): Block {
        requireMembership(workspaceId, userId)

        if (parentBlockId != null) {
            val parent = getBlockOrThrow(parentBlockId)
            require(parent.workspaceId == workspaceId) { "Parent block belongs to a different workspace" }
            require(parent.type == BlockType.PAGE) { "Only PAGE blocks can have child blocks" }
            require(!parent.isTrashed && !hasTrashedAncestor(parent)) { "Cannot add a block under a trashed parent" }
        }

        val block = Block(
            workspaceId = workspaceId,
            parentBlockId = parentBlockId,
            type = type,
            props = props,
            position = computePosition(workspaceId, parentBlockId, previousBlockId)
        )

        return blockRepository.save(block)
    }

    fun getBlock(id: Long, userId: Long): Block {
        val block = getBlockOrThrow(id)
        requireMembership(block.workspaceId, userId)
        require(!block.isTrashed && !hasTrashedAncestor(block)) { "Block not found: $id" }
        return block
    }

    fun getRootBlocks(workspaceId: Long, userId: Long): List<Block> {
        requireMembership(workspaceId, userId)
        return blockRepository.findByWorkspaceIdAndParentBlockIdIsNullAndIsTrashedFalseOrderByPosition(workspaceId)
    }

    fun getChildren(parentBlockId: Long, userId: Long): List<Block> {
        val parent = getBlockOrThrow(parentBlockId)
        requireMembership(parent.workspaceId, userId)
        require(!parent.isTrashed && !hasTrashedAncestor(parent)) { "Block not found: $parentBlockId" }
        return blockRepository.findByParentBlockIdAndIsTrashedFalseOrderByPosition(parentBlockId)
    }

    @Transactional
    fun updateProps(id: Long, props: Map<String, Any?>, userId: Long): Block {
        val block = getBlockOrThrow(id)
        requireMembership(block.workspaceId, userId)
        block.changeProps(props)
        return block
    }

    @Transactional
    fun moveBlock(id: Long, parentBlockId: Long?, previousBlockId: Long?, userId: Long): Block {
        val block = getBlockOrThrow(id)
        requireMembership(block.workspaceId, userId)

        if (parentBlockId != null) {
            val parent = getBlockOrThrow(parentBlockId)
            require(parent.workspaceId == block.workspaceId) { "Parent block belongs to a different workspace" }
            require(parent.type == BlockType.PAGE) { "Only PAGE blocks can have child blocks" }
            require(!parent.isTrashed && !hasTrashedAncestor(parent)) { "Cannot move a block under a trashed parent" }
        }

        block.moveTo(parentBlockId, computePosition(block.workspaceId, parentBlockId, previousBlockId, excludeId = id))

        return block
    }

    @Transactional
    fun trashBlock(id: Long, userId: Long): Block {
        val block = getBlockOrThrow(id)
        requireMembership(block.workspaceId, userId)
        block.trash()
        return block
    }

    @Transactional
    fun deleteBlock(id: Long, userId: Long) {
        val block = getBlockOrThrow(id)
        requireMembership(block.workspaceId, userId)
        blockRepository.delete(block)
    }

    private fun getBlockOrThrow(id: Long): Block {
        return blockRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Block not found: $id") }
    }

    private fun computePosition(
        workspaceId: Long,
        parentBlockId: Long?,
        previousBlockId: Long?,
        excludeId: Long? = null
    ): String {
        val previousPosition = previousBlockId?.let { getBlockOrThrow(it).position }

        val siblings = if (parentBlockId == null) {
            blockRepository.findByWorkspaceIdAndParentBlockIdIsNullAndIsTrashedFalseOrderByPosition(workspaceId)
        } else {
            blockRepository.findByParentBlockIdAndIsTrashedFalseOrderByPosition(parentBlockId)
        }

        val nextPosition = siblings
            .filter { it.id != excludeId && (previousPosition == null || it.position > previousPosition) }
            .minByOrNull { it.position }
            ?.position

        return PositionKeyGenerator.between(previousPosition, nextPosition)
    }

    private fun hasTrashedAncestor(block: Block): Boolean {
        var currentParentId = block.parentBlockId
        while (currentParentId != null) {
            val parent = blockRepository.findById(currentParentId).orElse(null) ?: return false
            if (parent.isTrashed) return true
            currentParentId = parent.parentBlockId
        }
        return false
    }

    private fun requireMembership(workspaceId: Long, userId: Long) {
        if (!workspaceAuthorizationService.isMember(workspaceId, userId)) {
            throw AccessDeniedException("Not a member of this workspace")
        }
    }
}
