package com.eventwisp.app.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TicketTypeUpdateDto {
    private String ticketType;
    private Double price;
    private Integer ticketCount;
}
