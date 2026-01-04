package com.eventwisp.app.dto.ticket;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BookedTicketDetailsDto {
    private String ticketType;
    private Integer ticketCount;
}
