package com.kiroku.workspace.entity

import com.kiroku.global.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "workspace_member",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uq_workspace_member_workspace_user",
            columnNames = ["workspace_id", "user_id"]
        )
    ]
)
class WorkspaceMember(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    val role: WorkspaceMemberRole,

) : BaseEntity()

enum class WorkspaceMemberRole {
    OWNER,
    ADMIN,
    MEMBER
}