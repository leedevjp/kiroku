package com.kiroku.workspace.service

import com.kiroku.workspace.entity.WorkspaceMemberRole
import com.kiroku.workspace.repository.WorkspaceMemberRepository
import org.springframework.stereotype.Service

@Service
class WorkspaceAuthorizationService(
    private val workspaceMemberRepository: WorkspaceMemberRepository
) {

    fun isOwner(workspaceId: Long, userId: Long): Boolean {
        val member = workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
            ?: return false

        return member.role == WorkspaceMemberRole.OWNER
    }
}
