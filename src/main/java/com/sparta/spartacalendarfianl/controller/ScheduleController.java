package com.sparta.spartacalendarfianl.controller;

import com.sparta.spartacalendarfianl.dto.ScheduleDTO;
import com.sparta.spartacalendarfianl.entity.Schedule;
import com.sparta.spartacalendarfianl.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 일정 생성 (POST)
    @PostMapping
    public int createSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        return scheduleService.createSchedule(scheduleDTO);
    }

    // 모든 일정 조회 (GET)
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // 특정 일정 조회 (GET)
    @GetMapping("/{id}")
    public Schedule getSchedule(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    // 일정 수정 (PUT)
    @PutMapping("/{id}")
    public Schedule updateSchedule(@PathVariable Long id, @RequestBody ScheduleDTO scheduleDTO) {
        return scheduleService.updateSchedule(id, scheduleDTO);
    }

    // 일정 삭제 (DELETE)
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id, @RequestParam String password) {
        scheduleService.deleteSchedule(id, password);
    }
}
