package com.eventwisp.app.dto.booking;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class BookingWithPaymentDto {
    private String paymentIntentId;     // <-- NEW
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String idNumber;
    private Long sessionId;
    private List<Long> ticketIdList;
}
