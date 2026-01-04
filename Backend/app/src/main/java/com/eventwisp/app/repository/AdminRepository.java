package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long> {

    //find admin by email address
    Optional<Admin> findByEmail(String email);

    Boolean existsByEmail(String email);
}
