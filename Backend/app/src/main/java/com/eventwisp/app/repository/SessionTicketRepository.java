package com.eventwisp.app.repository;

import com.eventwisp.app.entity.SessionTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionTicketRepository extends JpaRepository<SessionTicket,Long> {

    @Query("SELECT st FROM SessionTicket st WHERE st.session.id = :sessionId")
    List<SessionTicket> findSessionTicketsBySessionId(@Param("sessionId") Long sessionId);

}
