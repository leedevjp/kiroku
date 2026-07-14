package com.kiroku.workspace.dto

import com.kiroku.workspace.entity.Workspace

data class WorkspaceResponse(
    val id: Long,
    val name: String
) {
    companion object {
        fun from(workspace: Workspace): WorkspaceResponse {
            return WorkspaceResponse(
                id = workspace.id,
                name = workspace.name
            )
        }
    }
}
