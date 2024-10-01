package com.sparta.spartacalendarfianl.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class Schedule {
    private Long id;
    private String task;
    private String author;
    private String password;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 기본 생성자
    public Schedule(String task, String author, String password) {
        this.task = task;
        this.author = author;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 외부에서 날짜 주입 가능하게 수정
    public Schedule(String task, String author, String password, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.task = task;
        this.author = author;
        this.password = password;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    // 작업이 변경될 때마다 updatedAt 자동 갱신
    public void setTask(String task) {
        this.task = task;
        this.updatedAt = LocalDateTime.now();  // 수정될 때마다 갱신
    }

    // 다른 필드를 업데이트할 때도 마찬가지로 갱신
    public void setAuthor(String author) {
        this.author = author;
        this.updatedAt = LocalDateTime.now();
    }
}
