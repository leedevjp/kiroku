package com.kiroku

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KirokuApplication

fun main(args: Array<String>) {
	runApplication<KirokuApplication>(*args)
}
