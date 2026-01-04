package com.eventwisp.app.dto.response;

import com.eventwisp.app.entity.Ticket;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TicketUpdateResponse {
    private Long id;
    private boolean success;
    private String message;
    private Ticket ticket;
}
