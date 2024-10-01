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

    // 회원가입
    public void signup(UserDTO userDTO) {
        User user = new User(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword());
        userRepository.save(user);
    }

    // 로그인
    public User login(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }
}
