package com.eventwisp.app.dto.ticket;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TicketDetailsDto {
    private Long id;
    private String ticketType;
    private Double ticketPrice;
    private Integer ticketCount;
    private Integer soldCount;
}