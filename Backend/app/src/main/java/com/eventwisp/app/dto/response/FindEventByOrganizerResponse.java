package com.eventwisp.app.dto.response;

import com.eventwisp.app.dto.EventDetailsDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Setter
@Getter
public class FindEventByOrganizerResponse {
    private String message;
    private BigDecimal totalEarnings;
    private List<EventDetailsDto> onGoingEvents=Collections.emptyList();
    private List<EventDetailsDto> approvedEvents=Collections.emptyList();
    private List<EventDetailsDto> disapprovedEvents=Collections.emptyList();
    private List<EventDetailsDto> pendingApprovalEvents=Collections.emptyList();
    private List<EventDetailsDto> completedEvents=Collections.emptyList();
    private List<EventDetailsDto> allEvents= Collections.emptyList();
}
