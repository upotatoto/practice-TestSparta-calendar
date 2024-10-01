package com.sparta.spartacalendarfianl.repository;

import com.sparta.spartacalendarfianl.dto.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class ScheduleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 일정 추가
    public int save(Schedule schedule) {
        String sql = "INSERT INTO schedules (date, title) VALUES (?, ?)";
        return jdbcTemplate.update(sql, schedule.getDate(), schedule.getTitle());
    }

    // 모든 일정 조회
    public List<Schedule> findAll() {
        String sql = "SELECT * FROM schedules";
        return jdbcTemplate.query(sql, new ScheduleRowMapper());
    }

    // 날짜별 일정 조회
    public List<Schedule> findByDate(String date) {
        String sql = "SELECT * FROM schedules WHERE date = ?";
        return jdbcTemplate.query(sql, new Object[]{date}, new ScheduleRowMapper());
    }

    // ScheduleRowMapper 클래스는 ResultSet을 Schedule 객체로 변환
    private static class ScheduleRowMapper implements RowMapper<Schedule> {
        @Override
        public Schedule mapRow(ResultSet rs, int rowNum) throws SQLException {
            Schedule schedule = new Schedule();
            schedule.setId(rs.getLong("id"));
            schedule.setDate(rs.getString("date"));
            schedule.setTitle(rs.getString("title"));
            return schedule;
        }
    }
}
