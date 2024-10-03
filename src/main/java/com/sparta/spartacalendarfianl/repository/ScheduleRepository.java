package com.sparta.spartacalendarfianl.repository;

import com.sparta.spartacalendarfianl.entity.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class ScheduleRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 스케줄 저장
    public int save(Schedule schedule) {
        String sql = "INSERT INTO schedules (task, author, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, schedule.getTask(), schedule.getAuthor(), schedule.getPassword(), schedule.getCreatedAt(), schedule.getUpdatedAt());
    }

    // 스케줄 전체 조회
    public List<Schedule> findAll() {
        String sql = "SELECT * FROM schedules";
        return jdbcTemplate.query(sql, new ScheduleRowMapper());
    }

    // 스케줄 ID로 조회
    public Optional<Schedule> findById(Long id) {
        String sql = "SELECT * FROM schedules WHERE id = ?";
        return jdbcTemplate.query(sql, new ScheduleRowMapper(), id).stream().findFirst();
    }

    // 스케줄 삭제
    public int delete(Long id, String password) {
        String sql = "DELETE FROM schedules WHERE id = ? AND password = ?";
        return jdbcTemplate.update(sql, id, password);
    }

    // 스케줄을 매핑하는 RowMapper
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
