package com.sparta.spartacalendarfianl.controller;

import com.sparta.spartacalendarfianl.dto.UserDTO;
import com.sparta.spartacalendarfianl.entity.User;
import com.sparta.spartacalendarfianl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 회원가입
    @PostMapping("/signup")
    public String signup(@RequestBody UserDTO userDTO) {
        authService.signup(userDTO);
        return "회원가입 성공";
    }

    // 로그인
    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        User user = authService.login(username, password);
        if (user != null) {
            return "로그인 성공";
        } else {
            return "로그인 실패: 잘못된 아이디 또는 비밀번호";
        }
    }
}
