package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {

    //custom method for find events by organizer
    @Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId")
    List<Event> eventsByOrganizer(Long organizerId);

    //find all ongoing events
    @Query("SELECT e FROM Event e WHERE e.isCompleted = false")
    List<Event> findAllOnGoingEvents();

    @Query("SELECT e FROM Event e WHERE e.eventStatus.id = :statusId")
    List<Event> findEventByStatus(@Param("statusId") Long statusId);

    @Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId AND e.eventStatus.id = :statusId")
    List<Event> findOrganizerEventsByStatus(@Param("organizerId") Long organizerId,
                                            @Param("statusId") Long statusId);

    //find up coming events
    @Query("SELECT e FROM Event e WHERE e.eventCategory.category = :categoryName AND e.isPublished = true AND e.isApproved = true AND e.startingDate > CURRENT_DATE ORDER BY e.startingDate ASC")
    List<Event> findUpComingEventsByCategory(@Param("categoryName") String categoryName);

    //find event completion years
    @Query("SELECT DISTINCT YEAR(e.dateCompleted) FROM Event e WHERE e.organizer.id = :organizerId AND e.isCompleted = true")
    List<Integer> findEventCompletionYearsByOrganizer(@Param("organizerId") Long organizerId);

    //find by event id
    Event findByEventId(String eventId);


}

