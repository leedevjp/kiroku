package com.kiroku.global.security

import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration

@Service
class TokenBlacklistService(
    private val redisTemplate: StringRedisTemplate
) {

    fun blacklist(token: String, remainingValidityMillis: Long) {
        if (remainingValidityMillis <= 0) {
            return
        }

        redisTemplate.opsForValue().set(
            blacklistKey(token),
            "true",
            Duration.ofMillis(remainingValidityMillis)
        )
    }

    fun isBlacklisted(token: String): Boolean {
        return redisTemplate.hasKey(blacklistKey(token))
    }

    private fun blacklistKey(token: String): String {
        return "$BLACKLIST_KEY_PREFIX$token"
    }

    companion object {
        private const val BLACKLIST_KEY_PREFIX = "blacklist:"
    }
}
