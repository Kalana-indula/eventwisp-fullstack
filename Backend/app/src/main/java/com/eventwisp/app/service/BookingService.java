package com.eventwisp.app.service;

import com.eventwisp.app.dto.BookingDto;
import com.eventwisp.app.dto.booking.BookingDetailsDto;
import com.eventwisp.app.dto.response.CreateBookingResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.ticket.TicketIssueDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BookingService {
    //create a booking
    CreateBookingResponse createBooking(BookingDto bookingDto);

    //Find all bookings
    MultipleEntityResponse<BookingDetailsDto> findAllBookings();

    //Find all bookings by an event
    MultipleEntityResponse<BookingDetailsDto> findBookingsByEvent(Long eventId);

    SingleEntityResponse<BookingDetailsDto> findBookingDetailsByBookingId(String bookingId);

    SingleEntityResponse<TicketIssueDto> issueTickets(String bookingId);

    //add a calculator
    Long calculateExpectedAmountInCents(Long sessionId, List<Long> ticketIdList);
}
