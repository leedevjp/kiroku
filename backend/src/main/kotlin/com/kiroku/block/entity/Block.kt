package com.kiroku.block.entity

import com.kiroku.global.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Version
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@Entity
@Table(name = "block")
class Block(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    parentBlockId: Long?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    val type: BlockType,

    props: Map<String, Any?>,

    position: String,

) : BaseEntity() {

    @Column(name = "parent_block_id")
    var parentBlockId: Long? = parentBlockId
        protected set

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    var props: Map<String, Any?> = props
        protected set

    @Column(nullable = false, length = 64)
    var position: String = position
        protected set

    @Version
    @Column(nullable = false)
    var version: Int = 0
        protected set

    @Column(name = "is_trashed", nullable = false)
    var isTrashed: Boolean = false
        protected set

    fun changeProps(props: Map<String, Any?>) {
        this.props = props
    }

    fun moveTo(parentBlockId: Long?, position: String) {
        this.parentBlockId = parentBlockId
        this.position = position
    }

    fun trash() {
        this.isTrashed = true
    }
}

enum class BlockType {
    PAGE,
    PARAGRAPH,
    HEADING,
    TODO,
    IMAGE,
    CODE
}
