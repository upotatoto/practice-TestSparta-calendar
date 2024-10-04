package com.sparta.spartacalendarfianl.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // 홈 페이지 반환
    @GetMapping("/")
    public String index() {
        return "index";  // templates 폴더의 index.html을 반환
    }

    // 로그인 페이지 반환
    @GetMapping("/login")
    public String loginPage() {
        return "index";  // templates/login.html을 반환
    }

    // 회원가입 페이지 반환
    @GetMapping("/signup")
    public String signupPage() {
        return "signup";  // templates/signup.html을 반환
    }
}
