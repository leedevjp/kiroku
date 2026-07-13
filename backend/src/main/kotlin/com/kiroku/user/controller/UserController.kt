package com.kiroku.user.controller

import com.kiroku.user.dto.CreateUserRequest
import com.kiroku.user.dto.UserResponse
import com.kiroku.user.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @PostMapping
    fun createUser(
        @RequestBody request: CreateUserRequest
    ): ResponseEntity<UserResponse> {

        val user = userService.createUser(
            email = request.email,
            password = request.password,
            nickname = request.nickname
        )

        return ResponseEntity.ok(
            UserResponse.from(user)
        )
    }

    @GetMapping("/{id}")
    fun getUser(
        @PathVariable id: Long
    ): ResponseEntity<UserResponse> {

        val user = userService.getUser(id)

        return ResponseEntity.ok(
            UserResponse.from(user)
        )
    }

    @GetMapping
    fun getUsers(): ResponseEntity<List<UserResponse>> {

        val users = userService.getUsers()
            .map { UserResponse.from(it) }

        return ResponseEntity.ok(users)
    }

    @DeleteMapping("/{id}")
    fun deleteUser(
        @PathVariable id: Long
    ): ResponseEntity<Void> {

        userService.deleteUser(id)

        return ResponseEntity.noContent().build()
    }
}