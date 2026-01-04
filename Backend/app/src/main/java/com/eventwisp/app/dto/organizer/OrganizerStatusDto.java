package com.eventwisp.app.dto.organizer;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrganizerStatusDto {

    private Boolean pendingApproval;
    private Boolean isApproved;
    private Boolean isDisapproved;
}
