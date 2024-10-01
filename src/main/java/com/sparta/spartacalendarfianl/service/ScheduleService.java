package com.sparta.spartacalendarfianl.service;

import com.sparta.spartacalendarfianl.dto.ScheduleDTO;
import com.sparta.spartacalendarfianl.entity.Schedule;
import com.sparta.spartacalendarfianl.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // 일정 생성
    public Schedule createSchedule(ScheduleDTO scheduleDTO) {
        Schedule schedule = new Schedule(scheduleDTO.getTask(), scheduleDTO.getAuthor(), scheduleDTO.getPassword());
        scheduleRepository.save(schedule);
        return schedule;
    }

    // 모든 일정 조회
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // 특정 일정 조회
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    // 일정 수정
    public Schedule updateSchedule(Long id, ScheduleDTO scheduleDTO) {
        Schedule schedule = scheduleRepository.findById(id);

        if (!schedule.getPassword().equals(scheduleDTO.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        schedule.setTask(scheduleDTO.getTask());
        schedule.setAuthor(scheduleDTO.getAuthor());
        schedule.setUpdatedAt(LocalDateTime.now());
        scheduleRepository.update(schedule);

        return schedule;
    }

    // 일정 삭제
    public void deleteSchedule(Long id, String password) {
        int result = scheduleRepository.delete(id, password);
        if (result == 0) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않거나 일정이 존재하지 않습니다.");
        }
    }
}
