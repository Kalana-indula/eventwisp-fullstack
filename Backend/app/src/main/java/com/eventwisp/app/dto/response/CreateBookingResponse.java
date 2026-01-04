package com.eventwisp.app.dto.response;

import com.eventwisp.app.dto.booking.BookingDetailsDto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateBookingResponse {
    private String message;
    private BookingDetailsDto bookingDetails;
}
