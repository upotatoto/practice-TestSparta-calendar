package com.sparta.spartacalendarfianl.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String confirmPassword;  // 비밀번호 확인 필드 (회원가입 시 필요)

    // 기본 생성자
    public UserDTO(String username, String email, String password, String confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;  // 회원가입 시 비밀번호 확인을 위한 필드 추가
    }

    // ID를 포함한 생성자 (필요할 경우)
    public UserDTO(Long id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
