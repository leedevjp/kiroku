package com.kiroku.workspace.entity

import com.kiroku.global.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "workspace")
class Workspace(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    name: String,

) : BaseEntity() {

    @Column(nullable = false, length = 100)
    var name: String = name
        protected set

    fun changeName(name: String) {
        this.name = name
    }
}