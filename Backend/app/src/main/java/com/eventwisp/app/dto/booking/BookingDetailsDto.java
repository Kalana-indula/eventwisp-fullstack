package com.eventwisp.app.dto.booking;

import com.eventwisp.app.dto.ticket.BookedTicketDetailsDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Setter
@Getter
public class BookingDetailsDto {
    private String bookingId;
    private String eventName;
    private String name;
    private String email;
    private String phone;
    private String nic;
    private List<BookedTicketDetailsDto> ticketDetails;
    private Boolean ticketIssued;
    private LocalDate ticketIssuedDate;
    private LocalTime ticketIssuedTime;
}
