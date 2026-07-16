package com.kiroku.auth.dto

data class LoginRequest(
    val email: String,
    val password: String
)
