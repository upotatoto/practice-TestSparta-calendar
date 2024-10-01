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

    // 일정 생성
    public int createSchedule(ScheduleDTO scheduleDTO) {
        Schedule schedule = new Schedule();
        schedule.setTask(scheduleDTO.getTask());
        schedule.setAuthor(scheduleDTO.getAuthor());
        schedule.setPassword(scheduleDTO.getPassword());
        schedule.setCreatedAt(parseDate(scheduleDTO.getCreatedAt()));
        schedule.setUpdatedAt(parseDate(scheduleDTO.getUpdatedAt()));

        return scheduleRepository.save(schedule);
    }

    // 일정 수정
    public Schedule updateSchedule(Long id, ScheduleDTO scheduleDTO) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 일정이 존재하지 않습니다."));

        if (!schedule.getPassword().equals(scheduleDTO.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        schedule.setTask(scheduleDTO.getTask());
        schedule.setAuthor(scheduleDTO.getAuthor());
        schedule.setUpdatedAt(parseDate(scheduleDTO.getUpdatedAt()));
        return scheduleRepository.update(schedule);
    }

    // 다양한 형식의 날짜를 처리하는 메서드
    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return LocalDateTime.now();  // 날짜가 없을 경우 현재 시간을 사용
        }
        try {
            return LocalDateTime.parse(dateStr, formatter);  // 다양한 형식의 날짜를 처리
        } catch (Exception e) {
            throw new IllegalArgumentException("잘못된 날짜 형식입니다. 지원되는 형식: yyyy-MM-dd, yyyy/MM/dd, MM-dd-yyyy");
        }
    }

    // 모든 일정 조회
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // 특정 일정 조회
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("일정이 존재하지 않습니다."));
    }

    // 일정 삭제
    public void deleteSchedule(Long id, String password) {
        int result = scheduleRepository.delete(id, password);
        if (result == 0) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않거나 일정이 존재하지 않습니다.");
        }
    }
}
