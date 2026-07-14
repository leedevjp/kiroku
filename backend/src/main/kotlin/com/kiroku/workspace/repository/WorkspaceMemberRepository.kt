package com.kiroku.workspace.repository

import com.kiroku.workspace.entity.WorkspaceMember
import org.springframework.data.jpa.repository.JpaRepository

interface WorkspaceMemberRepository : JpaRepository<WorkspaceMember, Long> {
}
