package com.kiroku.workspace.repository

import com.kiroku.workspace.entity.WorkspaceMember
import org.springframework.data.jpa.repository.JpaRepository

interface WorkspaceMemberRepository : JpaRepository<WorkspaceMember, Long> {
    fun findByWorkspaceIdAndUserId(workspaceId: Long, userId: Long): WorkspaceMember?
    fun deleteAllByWorkspaceId(workspaceId: Long)
}
