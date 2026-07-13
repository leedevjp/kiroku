package com.kiroku.user.dto

import com.kiroku.user.entity.User

data class UserResponse(
    val id: Long,
    val email: String,
    val nickname: String?
) {
    companion object {
        fun from(user: User): UserResponse {
            return UserResponse(
                id = user.id,
                email = user.email,
                nickname = user.nickname
            )
        }
    }
}