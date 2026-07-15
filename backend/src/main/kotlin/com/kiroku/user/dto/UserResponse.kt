package com.kiroku.user.dto

import com.kiroku.user.entity.User
import java.time.Instant

data class UserResponse(
    val id: Long,
    val email: String,
    val nickname: String?,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    companion object {
        fun from(user: User): UserResponse {
            return UserResponse(
                id = user.id,
                email = user.email,
                nickname = user.nickname,
                createdAt = user.createdAt,
                updatedAt = user.updatedAt
            )
        }
    }
}