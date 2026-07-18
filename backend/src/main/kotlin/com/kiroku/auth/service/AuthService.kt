package com.kiroku.auth.service

import com.kiroku.global.exception.InvalidCredentialsException
import com.kiroku.global.security.JwtTokenProvider
import com.kiroku.global.security.TokenBlacklistService
import com.kiroku.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val tokenBlacklistService: TokenBlacklistService
) {

    fun login(email: String, password: String): String {
        val user = userRepository.findByEmail(email)
            ?: throw InvalidCredentialsException()

        if (!passwordEncoder.matches(password, user.password)) {
            throw InvalidCredentialsException()
        }

        return jwtTokenProvider.generateAccessToken(user.id)
    }

    fun logout(accessToken: String) {
        if (!jwtTokenProvider.validateToken(accessToken)) {
            return
        }

        val remainingValidityMillis = jwtTokenProvider.getRemainingExpirationMillis(accessToken)
        tokenBlacklistService.blacklist(accessToken, remainingValidityMillis)
    }
}
