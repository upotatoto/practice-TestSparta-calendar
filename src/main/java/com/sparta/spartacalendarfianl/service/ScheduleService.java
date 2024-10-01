package com.sparta.spartacalendarfianl.service;

import com.sparta.spartacalendarfianl.dto.Schedule;
import com.sparta.spartacalendarfianl.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // 일정 추가
    public void addSchedule(String date, String title) {
        Schedule schedule = new Schedule(date, title);
        scheduleRepository.save(schedule);
    }

    // 모든 일정 조회
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // 날짜별 일정 조회
    public List<Schedule> getSchedulesByDate(String date) {
        return scheduleRepository.findByDate(date);
    }
}
