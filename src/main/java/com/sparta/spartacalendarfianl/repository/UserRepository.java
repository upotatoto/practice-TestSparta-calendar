package com.sparta.spartacalendarfianl.repository;

import com.sparta.spartacalendarfianl.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Check if a username already exists
    boolean existsByUsername(String username);

    // Find a user by their username
    User findByUsername(String username);

    // Optional: Find a user by their email
    boolean existsByEmail(String email);

    // Optional: Find a user by username and password (for manual authentication if needed)
    User findByUsernameAndPassword(String username, String password);
}
