package com.kiroku.workspace.service

import com.kiroku.workspace.entity.Workspace
import com.kiroku.workspace.entity.WorkspaceMember
import com.kiroku.workspace.entity.WorkspaceMemberRole
import com.kiroku.workspace.repository.WorkspaceMemberRepository
import com.kiroku.workspace.repository.WorkspaceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMemberRepository
) {

    @Transactional
    fun createWorkspace(name: String, userId: Long): Workspace {
        val workspace = Workspace(name = name)
        val savedWorkspace = workspaceRepository.save(workspace)
        val workspaceMember = WorkspaceMember(
            workspaceId = savedWorkspace.id,
            userId = userId,
            role = WorkspaceMemberRole.OWNER
        )

        workspaceMemberRepository.save(workspaceMember)

        return savedWorkspace
    }

    fun getWorkspace(id: Long): Workspace {
        return workspaceRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Workspace not found: $id") }
    }

    fun getWorkspaces(): List<Workspace> {
        return workspaceRepository.findAll()
    }

    @Transactional
    fun deleteWorkspace(id: Long) {
        val workspace = getWorkspace(id)
        workspaceMemberRepository.deleteAllByWorkspaceId(id)
        workspaceRepository.delete(workspace)
    }
}
