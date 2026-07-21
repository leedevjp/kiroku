package com.kiroku.global.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException::class)
    fun handleInvalidCredentials(
        e: InvalidCredentialsException
    ): ResponseEntity<ErrorResponse> {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse(message = e.message ?: "Invalid email or password"))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(
        e: IllegalArgumentException
    ): ResponseEntity<ErrorResponse> {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(message = e.message ?: "Invalid request"))
    }
}
