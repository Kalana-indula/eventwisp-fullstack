package com.eventwisp.app.repository;

import com.eventwisp.app.entity.SystemBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemBankRepository extends JpaRepository<SystemBank, Long> {
}
