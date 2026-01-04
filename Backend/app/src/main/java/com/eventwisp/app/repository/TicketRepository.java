package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {

    //Custom query for find all the tickets by event
    @Query("SELECT t FROM Ticket t WHERE t.event.id = :eventId")
    List<Ticket> findTicketsByEvent(Long eventId);
}
