package com.kiroku.workspace.controller

import com.kiroku.workspace.dto.CreateWorkspaceRequest
import com.kiroku.workspace.dto.UpdateWorkspaceRequest
import com.kiroku.workspace.dto.WorkspaceResponse
import com.kiroku.workspace.service.WorkspaceAuthorizationService
import com.kiroku.workspace.service.WorkspaceService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/workspaces")
class WorkspaceController(
    private val workspaceService: WorkspaceService,
    private val workspaceAuthorizationService: WorkspaceAuthorizationService
) {

    @PostMapping
    fun createWorkspace(
        @RequestBody request: CreateWorkspaceRequest,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<WorkspaceResponse> {
        val workspace = workspaceService.createWorkspace(request.name, userId)

        return ResponseEntity.ok(
            WorkspaceResponse.from(workspace)
        )
    }

    @GetMapping("/{id}")
    fun getWorkspace(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<WorkspaceResponse> {
        if (!workspaceAuthorizationService.isMember(id, userId)) {
            throw AccessDeniedException("Not a member of this workspace")
        }

        val workspace = workspaceService.getWorkspace(id)

        return ResponseEntity.ok(
            WorkspaceResponse.from(workspace)
        )
    }

    @GetMapping
    fun getWorkspaces(
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<List<WorkspaceResponse>> {
        val workspaces = workspaceService.getWorkspaces(userId)
            .map { WorkspaceResponse.from(it) }

        return ResponseEntity.ok(workspaces)
    }

    @PatchMapping("/{id}")
    fun updateWorkspace(
        @PathVariable id: Long,
        @RequestBody request: UpdateWorkspaceRequest,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<WorkspaceResponse> {
        if (!workspaceAuthorizationService.isOwnerOrAdmin(id, userId)) {
            throw AccessDeniedException("Only the workspace owner or admin can update this workspace")
        }

        val workspace = workspaceService.updateName(id, request.name)

        return ResponseEntity.ok(
            WorkspaceResponse.from(workspace)
        )
    }

    @DeleteMapping("/{id}")
    fun deleteWorkspace(
        @PathVariable id: Long,
        @AuthenticationPrincipal userId: Long
    ): ResponseEntity<Void> {
        if (!workspaceAuthorizationService.isOwner(id, userId)) {
            throw AccessDeniedException("Only the workspace owner can delete this workspace")
        }

        workspaceService.deleteWorkspace(id)

        return ResponseEntity.noContent().build()
    }
}
