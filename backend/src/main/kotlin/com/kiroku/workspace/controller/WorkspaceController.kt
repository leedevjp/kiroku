package com.kiroku.workspace.controller

import com.kiroku.workspace.dto.CreateWorkspaceRequest
import com.kiroku.workspace.dto.WorkspaceResponse
import com.kiroku.workspace.service.WorkspaceService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/workspaces")
class WorkspaceController(
    private val workspaceService: WorkspaceService
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
        @PathVariable id: Long
    ): ResponseEntity<WorkspaceResponse> {
        val workspace = workspaceService.getWorkspace(id)

        return ResponseEntity.ok(
            WorkspaceResponse.from(workspace)
        )
    }

    @GetMapping
    fun getWorkspaces(): ResponseEntity<List<WorkspaceResponse>> {
        val workspaces = workspaceService.getWorkspaces()
            .map { WorkspaceResponse.from(it) }

        return ResponseEntity.ok(workspaces)
    }

    @DeleteMapping("/{id}")
    fun deleteWorkspace(
        @PathVariable id: Long
    ): ResponseEntity<Void> {
        workspaceService.deleteWorkspace(id)

        return ResponseEntity.noContent().build()
    }
}
