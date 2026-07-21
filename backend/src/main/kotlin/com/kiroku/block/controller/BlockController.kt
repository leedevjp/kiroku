package com.kiroku.block.controller

import com.kiroku.block.dto.BlockResponse
import com.kiroku.block.dto.CreateBlockRequest
import com.kiroku.block.dto.MoveBlockRequest
import com.kiroku.block.dto.UpdateBlockPropsRequest
import com.kiroku.block.service.BlockService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/blocks")
class BlockController(
    private val blockService: BlockService
) {

    @PostMapping
    fun createBlock(
        @RequestBody request: CreateBlockRequest,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<BlockResponse> {

        val block = blockService.createBlock(
            workspaceId = request.workspaceId,
            parentBlockId = request.parentBlockId,
            type = request.type,
            props = request.props,
            previousBlockId = request.previousBlockId,
            userId = userId
        )

        return ResponseEntity.ok(
            BlockResponse.from(block)
        )
    }

    @GetMapping("/{id}")
    fun getBlock(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<BlockResponse> {

        val block = blockService.getBlock(id, userId)

        return ResponseEntity.ok(
            BlockResponse.from(block)
        )
    }

    @GetMapping
    fun getRootBlocks(
        @RequestParam workspaceId: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<List<BlockResponse>> {

        val blocks = blockService.getRootBlocks(workspaceId, userId)
            .map { BlockResponse.from(it) }

        return ResponseEntity.ok(blocks)
    }

    @GetMapping("/{id}/children")
    fun getChildren(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<List<BlockResponse>> {

        val blocks = blockService.getChildren(id, userId)
            .map { BlockResponse.from(it) }

        return ResponseEntity.ok(blocks)
    }

    @PatchMapping("/{id}")
    fun updateProps(
        @PathVariable id: Long,
        @RequestBody request: UpdateBlockPropsRequest,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<BlockResponse> {

        val block = blockService.updateProps(id, request.props, userId)

        return ResponseEntity.ok(
            BlockResponse.from(block)
        )
    }

    @PatchMapping("/{id}/move")
    fun moveBlock(
        @PathVariable id: Long,
        @RequestBody request: MoveBlockRequest,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<BlockResponse> {

        val block = blockService.moveBlock(
            id = id,
            parentBlockId = request.parentBlockId,
            previousBlockId = request.previousBlockId,
            userId = userId
        )

        return ResponseEntity.ok(
            BlockResponse.from(block)
        )
    }

    @PatchMapping("/{id}/trash")
    fun trashBlock(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<BlockResponse> {

        val block = blockService.trashBlock(id, userId)

        return ResponseEntity.ok(
            BlockResponse.from(block)
        )
    }

    @DeleteMapping("/{id}")
    fun deleteBlock(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<Void> {

        blockService.deleteBlock(id, userId)

        return ResponseEntity.noContent().build()
    }
}
