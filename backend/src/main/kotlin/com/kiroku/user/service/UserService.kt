package com.kiroku.user.service

import com.kiroku.user.entity.User
import com.kiroku.user.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class UserService(
    private val userRepository: UserRepository
) {

    @Transactional
    fun createUser(
        email: String,
        password: String,
        nickname: String?
    ): User {
        val user = User(
            email = email,
            password = password,
            nickname = nickname
        )

        return userRepository.save(user)
    }

    fun getUser(id: Long): User {
        return userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found: $id") }
    }

    fun getUsers(): List<User> {
        return userRepository.findAll()
    }

    @Transactional
    fun deleteUser(id: Long) {
        val user = getUser(id)
        userRepository.delete(user)
    }
}