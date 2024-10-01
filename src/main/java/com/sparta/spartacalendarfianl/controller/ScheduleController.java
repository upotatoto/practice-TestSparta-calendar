package com.sparta.spartacalendarfianl.controller;

import com.sparta.spartacalendarfianl.dto.Schedule;
import com.sparta.spartacalendarfianl.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 일정 추가 (POST 요청)
    @PostMapping
    public void addSchedule(@RequestBody Schedule schedule) {
        scheduleService.addSchedule(schedule.getDate(), schedule.getTitle());
    }

    // 모든 일정 조회 (GET 요청)
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // 특정 날짜의 일정 조회 (GET 요청)
    @GetMapping("/{date}")
    public List<Schedule> getSchedulesByDate(@PathVariable String date) {
        return scheduleService.getSchedulesByDate(date);
    }
}
