package com.eventwisp.app.dto.ticket;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SessionTicketDetails {
    private Long ticketId;
    private Long sessionId;
    private Long eventId;
    private String ticketType;
    private Double ticketPrice;
    private Integer initialTicketCount;
    private Integer remainingTicketCount;
    private Integer soldTicketCount;
}
