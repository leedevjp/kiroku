package com.kiroku.global.security

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class TokenCookieProvider(
    private val jwtProperties: JwtProperties
) {

    fun createAccessTokenCookie(token: String): ResponseCookie {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE_NAME, token)
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path(COOKIE_PATH)
            .maxAge(Duration.ofMillis(jwtProperties.accessTokenExpirationMs))
            .build()
    }

    fun deleteAccessTokenCookie(): ResponseCookie {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE_NAME, "")
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path(COOKIE_PATH)
            .maxAge(0)
            .build()
    }

    fun extractAccessToken(request: HttpServletRequest): String? {
        return request.cookies?.firstOrNull { it.name == ACCESS_TOKEN_COOKIE_NAME }?.value
    }

    companion object {
        const val ACCESS_TOKEN_COOKIE_NAME = "access_token"
        private const val COOKIE_PATH = "/"
    }
}
