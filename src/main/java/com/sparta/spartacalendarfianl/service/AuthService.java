package com.sparta.spartacalendarfianl.service;

import com.sparta.spartacalendarfianl.dto.UserDTO;
import com.sparta.spartacalendarfianl.entity.User;
import com.sparta.spartacalendarfianl.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // 회원가입 처리
    public void signup(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자입니다.");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());  // 실제로는 비밀번호 암호화 필요

        userRepository.save(user);
    }

    // 로그인 검증 로직
    public boolean authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return true;  // 비밀번호 일치 시 로그인 성공
        }
        return false;  // 로그인 실패
    }
}
