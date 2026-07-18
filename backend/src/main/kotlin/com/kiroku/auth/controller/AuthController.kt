package com.kiroku.auth.controller

import com.kiroku.auth.dto.LoginRequest
import com.kiroku.auth.service.AuthService
import com.kiroku.global.security.TokenCookieProvider
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val tokenCookieProvider: TokenCookieProvider
) {

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {

        val accessToken = authService.login(request.email, request.password)

        response.addHeader(
            HttpHeaders.SET_COOKIE,
            tokenCookieProvider.createAccessTokenCookie(accessToken).toString()
        )

        return ResponseEntity.ok().build()
    }

    @PostMapping("/logout")
    fun logout(
        request: HttpServletRequest,
        response: HttpServletResponse
    ): ResponseEntity<Void> {

        tokenCookieProvider.extractAccessToken(request)?.let { accessToken ->
            authService.logout(accessToken)
        }

        response.addHeader(
            HttpHeaders.SET_COOKIE,
            tokenCookieProvider.deleteAccessTokenCookie().toString()
        )

        return ResponseEntity.ok().build()
    }
}
