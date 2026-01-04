package com.eventwisp.app.repository;

import com.eventwisp.app.entity.BookingSequenceTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSequenceRepository extends JpaRepository<BookingSequenceTracker,String> {
}
