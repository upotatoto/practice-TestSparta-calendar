package com.sparta.spartacalendarfianl.controller;

import com.sparta.spartacalendarfianl.dto.UserDTO;
import com.sparta.spartacalendarfianl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:63342")  // CORS 허용 설정
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody UserDTO userDTO) {
        try {
            authService.signup(userDTO);
            return "회원가입 성공";
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody UserDTO userDTO) {
        boolean isAuthenticated = authService.authenticate(userDTO.getUsername(), userDTO.getPassword());
        if (isAuthenticated) {
            return "로그인 성공";
        } else {
            return "로그인 실패";
        }
    }
}
