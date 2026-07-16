package com.kiroku.global.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    private val jwtProperties: JwtProperties
) {

    init {
        require(jwtProperties.secret.toByteArray().size >= MIN_SECRET_LENGTH_BYTES) {
            "JWT secret must be at least $MIN_SECRET_LENGTH_BYTES bytes (256 bits) for HS256. Check the JWT_SECRET environment variable."
        }
    }

    private val key: SecretKey = Keys.hmacShaKeyFor(jwtProperties.secret.toByteArray())
    private val parser: JwtParser = Jwts.parser().verifyWith(key).build()

    fun generateAccessToken(userId: Long): String {
        val now = Date()
        val expiry = Date(now.time + jwtProperties.accessTokenExpirationMs)

        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(now)
            .expiration(expiry)
            .signWith(key)
            .compact()
    }

    fun validateToken(token: String): Boolean {
        return try {
            parser.parseSignedClaims(token)
            true
        } catch (e: JwtException) {
            false
        } catch (e: IllegalArgumentException) {
            false
        }
    }

    fun getUserId(token: String): Long {
        val claims = parser.parseSignedClaims(token).payload
        return claims.subject.toLong()
    }

    companion object {
        private const val MIN_SECRET_LENGTH_BYTES = 32
    }
}
