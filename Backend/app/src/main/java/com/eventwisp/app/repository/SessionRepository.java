package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Custom method for find all Sessions by 'Event'
    @Query("SELECT s FROM Session s WHERE s.event.id = :eventId")
    List<Session> findSessionsByEvent(@Param("eventId") Long eventId);

    // Custom method to find all sessions of upcoming events by category
    @Query("""
        SELECT s FROM Session s 
        WHERE s.event.eventCategory.category = :categoryName 
        AND s.event.isPublished = true 
        AND s.event.isApproved = true 
        AND s.event.isCompleted=false
        ORDER BY s.event.startingDate ASC, s.date ASC, s.startTime ASC
    """)
    List<Session> findUpcomingSessionsByEventCategory(@Param("categoryName") String categoryName);

//     AND s.event.startingDate > CURRENT_DATE

    //find sessions by descending order of added
    @Query("""
    SELECT s FROM Session s 
    WHERE s.event.isPublished = true 
    AND s.event.isApproved = true 
    AND s.event.isCompleted=false
    ORDER BY s.event.dateAdded DESC
""")
    List<Session> findSessionsByDateAddedDesc();

    //find all sessions by event name

    @Query("SELECT s FROM Session s" +
            " WHERE s.event.eventName = :eventName" +
            " AND s.event.isPublished = true" +
            " AND s.event.isApproved = true" +
            " AND s.event.isCompleted = false")
    List<Session> findByEventName(@Param("eventName") String eventName);;
}