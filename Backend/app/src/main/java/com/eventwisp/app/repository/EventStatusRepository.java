package com.eventwisp.app.repository;

import com.eventwisp.app.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventStatusRepository extends JpaRepository<EventStatus, Long> {

}
