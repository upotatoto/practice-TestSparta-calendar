package com.sparta.spartacalendarfianl.controller;

import com.sparta.spartacalendarfianl.dto.UserDTO;
import com.sparta.spartacalendarfianl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 회원가입 요청 처리
    @PostMapping("/signup")
    public String signup(@RequestBody UserDTO userDTO) {
        try {
            authService.signup(userDTO);
            return "회원가입 성공";
        } catch (IllegalArgumentException e) {
            return e.getMessage();  // Return the error message if username is taken
        }
    }

    // 로그인 요청 처리 (DB에서 값 확인)
    @PostMapping("/login")
    public String login(@RequestBody UserDTO userDTO) {
        boolean isAuthenticated = authService.authenticate(userDTO.getUsername(), userDTO.getPassword());

        if (isAuthenticated) {
            return "로그인 성공";  // 성공 메시지 반환
        } else {
            return "로그인 실패";  // 실패 메시지 반환
        }
    }
}
