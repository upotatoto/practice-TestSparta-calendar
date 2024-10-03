package com.sparta.spartacalendarfianl.service;

import com.sparta.spartacalendarfianl.dto.ScheduleDTO;
import com.sparta.spartacalendarfianl.entity.Schedule;
import com.sparta.spartacalendarfianl.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // 다양한 날짜 형식을 지원하기 위한 포맷터
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("[yyyy-MM-dd][yyyy/MM/dd][MM-dd-yyyy]");

    public int createSchedule(ScheduleDTO scheduleDTO) {
        Schedule schedule = new Schedule();
        schedule.setTask(scheduleDTO.getTask());
        schedule.setAuthor(scheduleDTO.getAuthor());
        schedule.setPassword(scheduleDTO.getPassword());
        schedule.setCreatedAt(LocalDateTime.now());
        schedule.setUpdatedAt(LocalDateTime.now());

        return scheduleRepository.save(schedule);
    }

    public int updateSchedule(Long id, ScheduleDTO scheduleDTO) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정이 존재하지 않습니다."));

        if (!schedule.getPassword().equals(scheduleDTO.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        schedule.setTask(scheduleDTO.getTask());
        schedule.setAuthor(scheduleDTO.getAuthor());
        schedule.setUpdatedAt(LocalDateTime.now());
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정이 존재하지 않습니다."));
    }

    public void deleteSchedule(Long id, String password) {
        int result = scheduleRepository.delete(id, password);
        if (result == 0) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않거나 일정이 존재하지 않습니다.");
        }
    }
}
