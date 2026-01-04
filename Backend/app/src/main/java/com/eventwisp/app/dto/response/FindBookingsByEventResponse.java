package com.eventwisp.app.dto.response;

import com.eventwisp.app.entity.Booking;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Setter
@Getter
public class FindBookingsByEventResponse {
    private String message;
    private List<Booking> bookings= Collections.emptyList();
}
