package com.kiroku.workspace.repository

import com.kiroku.workspace.entity.Workspace
import org.springframework.data.jpa.repository.JpaRepository

interface WorkspaceRepository : JpaRepository<Workspace, Long> {
}
