package com.kiroku.workspace.repository

import com.kiroku.workspace.entity.Workspace
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface WorkspaceRepository : JpaRepository<Workspace, Long> {

    @Query(
        """
        SELECT w FROM Workspace w
        WHERE w.id IN (
            SELECT wm.workspaceId FROM WorkspaceMember wm WHERE wm.userId = :userId
        )
        """
    )
    fun findAllByMemberUserId(@Param("userId") userId: Long): List<Workspace>
}
