package com.eventwisp.app.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class CreateIntentRequest {
    private Long sessionId;
    private List<Long> ticketIdList;
    private String email;
}
