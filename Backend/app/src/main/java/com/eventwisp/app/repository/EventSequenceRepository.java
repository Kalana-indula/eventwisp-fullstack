package com.eventwisp.app.repository;

import com.eventwisp.app.entity.EventSequenceTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventSequenceRepository extends JpaRepository<EventSequenceTracker,String> {
}
