package com.sparta.spartacalendarfianl.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ScheduleDTO {
    private Long id;
    private String task;
    private String author;
    private String password;
    private String createdAt;  // String 형식으로 받음
    private String updatedAt;  // String 형식으로 받음

    public ScheduleDTO(String task, String author, String password) {
        this.task = task;
        this.author = author;
        this.password = password;
    }
}
