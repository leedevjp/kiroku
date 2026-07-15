package com.kiroku.user.entity

import com.kiroku.global.entity.BaseTimeEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "\"user\"")
class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val email: String,

    password: String,

    nickname: String? = null,
) : BaseTimeEntity() {

    @Column(nullable = false)
    var password: String = password
        protected set

    @Column(length = 50)
    var nickname: String? = nickname
        protected set

    fun changePassword(password: String) {
        this.password = password
    }

    fun changeNickname(nickname: String?) {
        this.nickname = nickname
    }
}