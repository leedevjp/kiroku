package com.kiroku.global.entity

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.LastModifiedBy

@MappedSuperclass
abstract class BaseEntity : BaseTimeEntity() {

    @CreatedBy
    @Column(name = "created_by", nullable = false, updatable = false)
    var createdBy: Long = 0
        protected set

    @LastModifiedBy
    @Column(name = "updated_by", nullable = false)
    var updatedBy: Long = 0
        protected set
}
