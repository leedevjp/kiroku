package com.kiroku.workspace.service

import com.kiroku.workspace.entity.Workspace
import com.kiroku.workspace.repository.WorkspaceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class WorkspaceService(
    private val workspaceRepository: WorkspaceRepository
) {

    @Transactional
    fun createWorkspace(name: String): Workspace {
        val workspace = Workspace(name = name)

        return workspaceRepository.save(workspace)
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
        workspaceRepository.delete(workspace)
    }
}
