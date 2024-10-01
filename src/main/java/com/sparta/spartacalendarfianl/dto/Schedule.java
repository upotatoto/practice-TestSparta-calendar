package com.sparta.spartacalendarfianl.dto;

public class Schedule {

    private Long id;
    private String date;
    private String title;

    // 기본 생성자
    public Schedule() {
    }

    // 생성자
    public Schedule(String date, String title) {
        this.date = date;
        this.title = title;
    }

    // Getter와 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
