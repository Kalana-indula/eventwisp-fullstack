package com.eventwisp.app.dto.sessionDto;

import com.eventwisp.app.dto.ticket.SessionTicketDetails;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class EventParticipationDetails {
    private Long sessionId;
    private String sessionNumber;
    private List<SessionTicketDetails> ticketDetails;
}
