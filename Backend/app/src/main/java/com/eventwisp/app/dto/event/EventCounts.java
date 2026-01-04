package com.eventwisp.app.dto.event;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EventCounts {
    private Integer onGoingEventsCount;
    private Integer pendingApprovalEventsCount;
    private Integer approvedEventsCount;
    private Integer disapprovedEventsCount;
    private Integer completedEventsCount;
    private Integer allEventsCount;
}
