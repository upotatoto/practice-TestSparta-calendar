package com.sparta.spartacalendarfianl.repository;

import com.sparta.spartacalendarfianl.entity.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ScheduleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 일정 저장 (CREATE)
    public int save(Schedule schedule) {
        String sql = "INSERT INTO schedules (task, author, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, schedule.getTask(), schedule.getAuthor(), schedule.getPassword(),
                schedule.getCreatedAt(), schedule.getUpdatedAt());
    }

    // 일정 수정 (UPDATE)
    public Schedule update(Schedule schedule) {
        String sql = "UPDATE schedules SET task = ?, author = ?, updated_at = ? WHERE id = ? AND password = ?";
        jdbcTemplate.update(sql, schedule.getTask(), schedule.getAuthor(), schedule.getUpdatedAt(),
                schedule.getId(), schedule.getPassword());
        return schedule;
    }

    // 일정 삭제 (DELETE)
    public int delete(Long id, String password) {
        String sql = "DELETE FROM schedules WHERE id = ? AND password = ?";
        return jdbcTemplate.update(sql, id, password);
    }

    // 모든 일정 조회 (READ ALL)
    public List<Schedule> findAll() {
        String sql = "SELECT * FROM schedules";
        return jdbcTemplate.query(sql, new ScheduleRowMapper());
    }

    // 특정 일정 조회 (READ ONE)
    public Optional<Schedule> findById(Long id) {
        String sql = "SELECT * FROM schedules WHERE id = ?";
        return jdbcTemplate.query(sql, new ScheduleRowMapper(), id)
                .stream().findFirst();  // Optional로 반환
    }

    // ScheduleRowMapper (ResultSet -> Schedule 변환)
    private static class ScheduleRowMapper implements RowMapper<Schedule> {
        @Override
        public Schedule mapRow(ResultSet rs, int rowNum) throws SQLException {
            Schedule schedule = new Schedule();
            schedule.setId(rs.getLong("id"));
            schedule.setTask(rs.getString("task"));
            schedule.setAuthor(rs.getString("author"));
            schedule.setPassword(rs.getString("password"));
            schedule.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            schedule.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return schedule;
        }
    }
}
