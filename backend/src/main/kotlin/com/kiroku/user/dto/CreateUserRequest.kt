package com.kiroku.user.dto

data class CreateUserRequest(
    val email: String,
    val password: String,
    val nickname: String?
)