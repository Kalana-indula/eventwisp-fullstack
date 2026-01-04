package com.eventwisp.app.dto.booking;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BookingEmailDto {
    private String to;
    private String bookingId;
    private String qrPngBase64;
}
