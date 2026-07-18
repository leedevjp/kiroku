package com.kiroku.global.security

import org.springframework.data.domain.AuditorAware
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.util.Optional

@Component("auditorAware")
class SecurityAuditorAware : AuditorAware<Long> {

    override fun getCurrentAuditor(): Optional<Long> {
        val principal = SecurityContextHolder.getContext().authentication?.principal
        return Optional.ofNullable(principal as? Long)
    }
}
