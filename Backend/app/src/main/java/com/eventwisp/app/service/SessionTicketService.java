package com.eventwisp.app.service;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.sessionDto.EventParticipationDetails;
import com.eventwisp.app.dto.ticket.SessionTicketDetails;
import org.springframework.stereotype.Service;

@Service
public interface SessionTicketService {

    //Find ticket details of a session
    MultipleEntityResponse<SessionTicketDetails> getTicketDetailsBySessionId(Long sessionId);

    //find participation details of event
    MultipleEntityResponse<EventParticipationDetails> getEventTicketSalesBySession(Long eventId);
}
