package com.kiroku.block.util

object PositionKeyGenerator {

    private const val ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    private val BASE = ALPHABET.length

    fun between(previous: String?, next: String?): String {
        return midpoint(previous ?: "", next ?: "")
    }

    private fun midpoint(previous: String, next: String): String {
        val result = StringBuilder()
        var i = 0

        while (true) {
            val lo = if (i < previous.length) charValue(previous[i]) else 0
            val hi = if (i < next.length) charValue(next[i]) else BASE

            if (hi - lo > 1) {
                result.append(ALPHABET[lo + (hi - lo) / 2])
                return result.toString()
            }

            result.append(ALPHABET[lo])
            i++
        }
    }

    private fun charValue(c: Char): Int = ALPHABET.indexOf(c)
}
