package com.kiroku.user.service

import com.kiroku.user.entity.User
import com.kiroku.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun createUser(
        email: String,
        password: String,
        nickname: String?
    ): User {
        val user = User(
            email = email,
            password = passwordEncoder.encode(password)!!,
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
    fun updateNickname(id: Long, nickname: String?): User {
        val user = getUser(id)
        user.changeNickname(nickname)
        return user
    }

    @Transactional
    fun changePassword(id: Long, password: String) {
        val user = getUser(id)
        user.changePassword(passwordEncoder.encode(password)!!)
    }

    @Transactional
    fun deleteUser(id: Long) {
        val user = getUser(id)
        userRepository.delete(user)
    }
}